import { Response } from 'express';
import prisma from '../config/db';
import { razorpay } from '../config/razorpay';
import { AuthRequest } from '../middleware/auth';
import crypto from 'crypto';

export const placeOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { totalAmount, paymentMethod = 'ONLINE', deliveryAddress, cartItems: bodyCartItems } = req.body;

    if (!totalAmount || totalAmount <= 0) {
      res.status(400).json({ error: 'Valid totalAmount is required' });
      return;
    }

    // 1. Use cart items from request body if provided, else fallback to DB
    let cartItems: any[] = [];

    if (bodyCartItems && Array.isArray(bodyCartItems) && bodyCartItems.length > 0) {
      // Frontend passed items directly — use them
      cartItems = bodyCartItems;
    } else {
      // Fallback: fetch from DB
      const dbItems = await prisma.cartItem.findMany({
        where: { userId },
        include: { product: true }
      });
      cartItems = dbItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: Number(item.product.price),
        size: item.size,
        removedToppings: item.removedToppings,
        addedExtras: item.addedExtras,
      }));
    }

    if (!cartItems || cartItems.length === 0) {
      res.status(400).json({ error: 'Cart is empty' });
      return;
    }

    // Execute in a transaction for data consistency
    const result = await prisma.$transaction(async (tx) => {
      // 2. Create Order
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount: totalAmount,
          status: 'Placed',
          paymentStatus: paymentMethod === 'COD' ? 'Pending (COD)' : 'Initiated',
        }
      });

      // 3. Create Order Items from the cart items
      const orderItemsData = cartItems.map((item: any) => ({
        orderId: newOrder.id,
        productId: item.productId || item.menuItemId,
        quantity: item.quantity,
        price: item.price,
        size: item.size || null,
        removedToppings: item.removedToppings || [],
        addedExtras: item.addedExtras || []
      }));

      await tx.orderItem.createMany({ data: orderItemsData });

      // 4. Clear DB cart (best effort)
      await tx.cartItem.deleteMany({ where: { userId } }).catch(() => {});

      return newOrder;
    });

    const order = result;

    // 5. Razorpay integration for ONLINE payment
    if (paymentMethod === 'ONLINE') {
      const options = {
        amount: Math.round(totalAmount * 100),
        currency: 'INR',
        receipt: `rcpt_${order.id.replace(/-/g, '').slice(0, 32)}`,
      };

      try {
        const rpOrder = await razorpay.orders.create(options);
        
        await prisma.payment.create({
          data: {
            orderId: order.id,
            razorpayOrderId: rpOrder.id,
            status: 'Created'
          }
        });

        res.status(201).json({
          message: 'Order placed, proceed to payment',
          order,
          razorpayOrderId: rpOrder.id,
          amount: rpOrder.amount,
          currency: rpOrder.currency,
        });
        return;
      } catch (rpError) {
        console.error('Razorpay Error:', rpError);
        res.status(500).json({ error: 'Failed to initialize payment gateway' });
        return;
      }
    }

    // Response for COD
    res.status(201).json({ message: 'Order placed successfully via COD', order });

  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Internal server error during processing' });
  }
};


export const verifyPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400).json({ error: 'Missing payment details' });
      return;
    }

    const secret = process.env.RAZORPAY_KEY_SECRET as string;

    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      // Payment Failed
      await prisma.$transaction([
        prisma.payment.updateMany({
          where: { razorpayOrderId: razorpay_order_id },
          data: { status: 'Failed' }
        }),
        prisma.order.update({
          where: { id: order_id },
          data: { paymentStatus: 'Failed' }
        })
      ]);
      res.status(400).json({ error: 'Payment verification failed' });
      return;
    }

    // Payment Success
    await prisma.$transaction([
      prisma.payment.updateMany({
        where: { razorpayOrderId: razorpay_order_id },
        data: { status: 'Success', razorpayPaymentId: razorpay_payment_id }
      }),
      prisma.order.update({
        where: { id: order_id },
        data: { paymentStatus: 'Success' }
      })
    ]);

    res.status(200).json({ message: 'Payment verified successfully' });

  } catch (err) {
    res.status(500).json({ error: 'Internal server error during verification' });
  }
};

export const getOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error fetching orders' });
  }
};
