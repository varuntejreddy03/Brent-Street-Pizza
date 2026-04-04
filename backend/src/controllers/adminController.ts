import { Request, Response } from 'express';
import prisma from '../config/db';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalOrders = await prisma.order.count();
    const totalProducts = await prisma.product.count();
    const totalUsers = await prisma.user.count();
    
    const revenueAggregation = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { paymentStatus: 'Paid' } 
    });

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } }
    });

    res.json({
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue: revenueAggregation._sum.totalAmount || 0,
      recentOrders
    });
  } catch (error) {
    console.error('getDashboardStats error:', error);
    res.status(500).json({ error: 'Server error fetching stats' });
  }
};

export const getOrdersAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { 
        user: { select: { name: true, email: true, phone: true } },
        orderItems: { include: { product: { select: { name: true, price: true } } } },
        payments: true
      }
    });
    res.json(orders);
  } catch (error) {
    console.error('getOrdersAdmin error:', error);
    res.status(500).json({ error: 'Error fetching orders' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const { status, paymentStatus } = req.body;
  try {
    const data: any = {};
    if (status) data.status = status;
    if (paymentStatus) data.paymentStatus = paymentStatus;

    if (Object.keys(data).length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }

    const order = await prisma.order.update({
      where: { id },
      data
    });
    res.json({ message: 'Order updated', order });
  } catch (error) {
    console.error('updateOrderStatus error:', error);
    res.status(500).json({ error: 'Error updating order' });
  }
};

export const getProductsAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { categoryId: 'asc' }
    });
    res.json(products);
  } catch (error) {
    console.error('getProductsAdmin error:', error);
    res.status(500).json({ error: 'Error fetching products' });
  }
};

export const createProductAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    // Basic validation could go here
    const { id, categoryId, name, description, price, image, tags, sizes, toppings, hasPizzaExtras, isFavorite } = req.body;
    
    if (!id || !categoryId || !name || price == null || !image) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const product = await prisma.product.create({
      data: {
        id,
        categoryId,
        name,
        description,
        price,
        image,
        tags,
        sizes,
        toppings,
        hasPizzaExtras: hasPizzaExtras || false,
        isFavorite: isFavorite || false
      }
    });
    res.status(201).json(product);
  } catch (error: any) {
    console.error('createProductAdmin error:', error);
    res.status(500).json({ error: error.message || 'Error creating product' });
  }
};

export const updateProductAdmin = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;
  try {
    const product = await prisma.product.update({
      where: { id },
      data: req.body
    });
    res.json(product);
  } catch (error: any) {
    console.error('updateProductAdmin error:', error);
    res.status(500).json({ error: error.message || 'Error updating product' });
  }
};

export const deleteProductAdmin = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;
  try {
    await prisma.product.delete({ where: { id } });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('deleteProductAdmin error:', error);
    res.status(500).json({ error: 'Error deleting product' });
  }
};

export const getAllContentAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const content = await prisma.uIContent.findMany({
      orderBy: [
        { section: 'asc' },
        { key: 'asc' }
      ]
    });
    res.json(content);
  } catch (error) {
    console.error('getAllContentAdmin error:', error);
    res.status(500).json({ error: 'Error fetching UI content' });
  }
};

export const updateContentAdmin = async (req: Request, res: Response): Promise<void> => {
  const { section, key, value, type } = req.body;
  
  if (!section || !key || value === undefined) {
    res.status(400).json({ error: 'Missing required content fields' });
    return;
  }

  try {
    const content = await prisma.uIContent.upsert({
      where: { 
        section_key: { 
          section, 
          key 
        } 
      },
      update: { value, type: type || 'text' },
      create: { section, key, value, type: type || 'text' }
    });
    res.json(content);
  } catch (error) {
    console.error('updateContentAdmin error:', error);
    res.status(500).json({ error: 'Error updating content' });
  }
};

export const getCategoriesAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(categories);
  } catch (error) {
    console.error('getCategoriesAdmin error:', error);
    res.status(500).json({ error: 'Error fetching categories' });
  }
};

export const createCategoryAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, name, description, isActive } = req.body;
    if (!id || !name) {
      res.status(400).json({ error: 'ID and Name are required' });
      return;
    }
    const category = await prisma.category.create({
      data: { id, name, description, isActive: isActive ?? true }
    });
    res.status(201).json(category);
  } catch (error: any) {
    console.error('createCategoryAdmin error:', error);
    res.status(500).json({ error: error.message || 'Error creating category' });
  }
};

export const updateCategoryAdmin = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;
  try {
    const category = await prisma.category.update({
      where: { id },
      data: req.body
    });
    res.json(category);
  } catch (error: any) {
    console.error('updateCategoryAdmin error:', error);
    res.status(500).json({ error: error.message || 'Error updating category' });
  }
};

export const deleteCategoryAdmin = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;
  try {
    await prisma.category.delete({ where: { id } });
    res.json({ message: 'Category deleted' });
  } catch (error: any) {
    console.error('deleteCategoryAdmin error:', error);
    res.status(500).json({ error: error.message || 'Error deleting category' });
  }
};

export const getPizzaExtrasAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const extras = await prisma.pizzaExtra.findMany();
    res.json(extras);
  } catch (error) {
    console.error('getPizzaExtrasAdmin error:', error);
    res.status(500).json({ error: 'Error fetching pizza extras' });
  }
};

export const updatePizzaExtraAdmin = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;
  try {
    const extra = await prisma.pizzaExtra.update({
      where: { id },
      data: req.body
    });
    res.json(extra);
  } catch (error: any) {
    console.error('updatePizzaExtraAdmin error:', error);
    res.status(500).json({ error: error.message || 'Error updating pizza extra' });
  }
};
