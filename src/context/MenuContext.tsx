import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { MenuItem, MenuCategory, ExtraCategory } from '../types/menu';

interface MenuContextType {
  categories: MenuCategory[];
  menuItems: MenuItem[];
  extras: ExtraCategory[];
  isLoading: boolean;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [extras, setExtrasState] = useState<ExtraCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCatalog = useCallback(async () => {
    try {
      setIsLoading(true);

      // Run all three fetches in parallel for speed
      const [catRes, prodRes, extrasRes] = await Promise.all([
        fetch('/api/catalog/categories'),
        fetch('/api/catalog/products'),
        fetch('/api/catalog/pizza-extras'),
      ]);

      const [catData, prodData, extrasData] = await Promise.all([
        catRes.json(),
        prodRes.json(),
        extrasRes.json(),
      ]);

      if (catData.categories?.length) setCategories(catData.categories);
      if (prodData.products?.length) setMenuItems(prodData.products);
      if (extrasData.pizza_extras?.length) setExtrasState(extrasData.pizza_extras);

    } catch (err) {
      console.error('Failed to load menu data from backend:', err);
      // Retry once after 2 seconds if initial fetch failed
      setTimeout(async () => {
        try {
          const [catRes, prodRes] = await Promise.all([
            fetch('/api/catalog/categories'),
            fetch('/api/catalog/products'),
          ]);
          const [catData, prodData] = await Promise.all([catRes.json(), prodRes.json()]);
          if (catData.categories?.length) setCategories(catData.categories);
          if (prodData.products?.length) setMenuItems(prodData.products);
        } catch (retryErr) {
          console.error('Retry also failed:', retryErr);
        }
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  return (
    <MenuContext.Provider value={{ categories, menuItems, extras, isLoading }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};
