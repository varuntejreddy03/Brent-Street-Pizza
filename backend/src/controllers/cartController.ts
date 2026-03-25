import { Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const cartItemsData = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true }
    });

    // Format cart items to match the frontend shape
    const formattedCart = cartItemsData.map(item => ({
      id: item.id,
      menuItemId: item.productId,
      name: item.product.name,
      price: Number(item.product.price),
      quantity: item.quantity,
      image: item.product.image,
      size: item.size,
      removedToppings: item.removedToppings,
      addedExtras: item.addedExtras
    }));

    res.status(200).json({ cartItems: formattedCart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error fetching cart' });
  }
};

export const addToCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { menuItemId, quantity = 1, size, removedToppings, addedExtras } = req.body;

    if (!menuItemId) {
      res.status(400).json({ error: 'menuItemId is required' });
      return;
    }

    const newCartItem = await prisma.cartItem.create({
      data: {
        userId,
        productId: menuItemId,
        quantity,
        size,
        removedToppings: removedToppings || [],
        addedExtras: addedExtras || []
      }
    });

    res.status(201).json({ message: 'Item added to cart', cartItem: newCartItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error adding to cart' });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const id = req.params.id as string;
    const { quantity } = req.body;

    if (quantity === undefined) {
      res.status(400).json({ error: 'quantity is required' });
      return;
    }

    const updatedItem = await prisma.cartItem.updateMany({
      where: { id, userId },
      data: { quantity }
    });

    if (updatedItem.count === 0) {
      res.status(404).json({ error: 'Cart item not found or unauthorized' });
      return;
    }

    // Since updatemany doesnt return the record, we fetch it
    const item = await prisma.cartItem.findUnique({ where: { id } });

    res.status(200).json({ message: 'Cart item updated', cartItem: item });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error updating cart item' });
  }
};

export const removeCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const id = req.params.id as string;

    const deleted = await prisma.cartItem.deleteMany({
      where: { id, userId }
    });

    if (deleted.count === 0) {
      res.status(404).json({ error: 'Cart item not found or unauthorized' });
      return;
    }

    res.status(200).json({ message: 'Cart item removed' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error removing cart item' });
  }
};

export const clearCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    await prisma.cartItem.deleteMany({ where: { userId } });
    res.status(200).json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error clearing cart' });
  }
};
