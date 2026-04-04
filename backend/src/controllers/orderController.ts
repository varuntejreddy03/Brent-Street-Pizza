import { Response } from 'express';
import prisma from '../config/db';
import { stripe } from '../config/stripe';
import { AuthRequest } from '../middleware/auth';
import type Stripe from 'stripe';

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

    // 5. Stripe integration for ONLINE payment
    if (paymentMethod === 'ONLINE') {
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(Number(totalAmount) * 100),
          currency: 'aud',
          metadata: {
            orderId: order.id,
            userId: userId
          }
        });

        // Use standard Prisma access
        await prisma.payment.create({
          data: {
            orderId: order.id,
            provider: 'Stripe',
            gatewayOrderId: paymentIntent.id,
            status: 'Requires_Payment_Method'
          }
        });

        res.status(201).json({
          message: 'Order placed, proceed to payment',
          order,
          clientSecret: paymentIntent.client_secret,
          stripePublishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY,
        });
        return;
      } catch (stripeError) {
        console.error('Stripe Error:', stripeError);
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


export const stripeWebhook = async (req: any, res: Response): Promise<void> => {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle successful payments
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const orderId = paymentIntent.metadata.orderId;

    if (orderId) {
      await prisma.$transaction([
        (prisma.payment as any).updateMany({
          where: { gatewayOrderId: paymentIntent.id },
          data: { status: 'Success', gatewayPaymentId: paymentIntent.latest_charge as string }
        }),
        prisma.order.update({
          where: { id: orderId },
          data: { paymentStatus: 'Success' }
        })
      ]);
    }
  }

  res.json({ received: true });
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

export const updatePaymentStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { orderId, status } = req.body;
    
    if (!orderId || !status) {
      res.status(400).json({ error: 'OrderId and status are required' });
      return;
    }

    // Securely update order and payment status
    await prisma.$transaction([
      prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: status }
      }),
      (prisma.payment as any).updateMany({
        where: { orderId: orderId },
        data: { status: status === 'Paid' ? 'Success' : status }
      })
    ]);

    res.json({ message: 'Order payment status updated successfully' });
  } catch (err) {
    console.error('updatePaymentStatus error:', err);
    res.status(500).json({ error: 'Failed to update payment status' });
  }
};
