import { Request, Response } from 'express';
import prisma from '../config/db';

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json({ categories });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error while fetching categories' });
  }
};

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.query;
    let whereClause = {};
    
    if (category) {
      whereClause = { categoryId: String(category) };
    }

    const products = await prisma.product.findMany({ where: whereClause });

    // Coerce Prisma Decimal to plain JS number so frontend .toFixed() works
    const serialized = products.map(p => ({
      ...p,
      price: Number(p.price),
      sizes: p.sizes ? (p.sizes as any[]).map((s: any) => ({ ...s, price: Number(s.price) })) : null,
    }));

    res.status(200).json({ products: serialized });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error while fetching products' });
  }
};

export const getPizzaExtras = async (req: Request, res: Response): Promise<void> => {
  try {
    const pizzaExtras = await prisma.pizzaExtra.findMany();
    // frontend might expect it as `pizza_extras` key
    res.status(200).json({ pizza_extras: pizzaExtras });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error while fetching pizza extras' });
  }
};
