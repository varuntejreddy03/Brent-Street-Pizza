import { Request, Response } from 'express';
import prisma from '../config/db';

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const showInactive = req.query.showInactive === 'true';
    const whereClause: any = {};
    if (!showInactive) {
      whereClause.isActive = true;
    }
    const categories = await prisma.category.findMany({ where: whereClause });
    res.status(200).json({ categories });
  } catch (err: any) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Internal server error while fetching categories', details: err.message });
  }
};

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, isFavorite } = req.query;
    let whereClause: any = {};
    
    if (category) {
      whereClause.categoryId = String(category);
    }
    
    if (isFavorite === 'true') {
      whereClause.isFavorite = true;
    }

    // Default: hide inactive. Only show if showInactive=true (for Admin)
    const showInactive = req.query.showInactive === 'true';
    if (!showInactive) {
      whereClause.isActive = true;
    }

    const products = await prisma.product.findMany({ where: whereClause });

    // Coerce Prisma Decimal to plain JS number so frontend .toFixed() works
    const serialized = products.map(p => ({
      ...p,
      price: Number(p.price),
      sizes: p.sizes ? (p.sizes as any[]).map((s: any) => ({ ...s, price: Number(s.price) })) : null,
    }));

    res.status(200).json({ products: serialized });
  } catch (err: any) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Internal server error while fetching products', details: err.message });
  }
};

export const getPizzaExtras = async (req: Request, res: Response): Promise<void> => {
  try {
    const pizzaExtras = await prisma.pizzaExtra.findMany();
    // frontend might expect it as `pizza_extras` key
    res.status(200).json({ pizza_extras: pizzaExtras });
  } catch (err: any) {
    console.error('Error fetching pizza extras:', err);
    res.status(500).json({ error: 'Internal server error while fetching pizza extras', details: err.message });
  }
};
