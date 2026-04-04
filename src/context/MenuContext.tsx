import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_URL } from '../config/api';
import type { MenuItem, MenuCategory, ExtraCategory } from '../types/menu';

interface MenuContextType {
  categories: MenuCategory[];
  menuItems: MenuItem[];
  extras: ExtraCategory[];
  isLoading: boolean;
  refreshMenu: (showInactive?: boolean) => Promise<void>;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [extras, setExtrasState] = useState<ExtraCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCatalog = useCallback(async (showInactive = false) => {
    try {
      setIsLoading(true);

      const query = showInactive ? '?showInactive=true' : '';
      const [catRes, prodRes, extrasRes] = await Promise.all([
        fetch(`${API_URL}/api/catalog/categories${query}`),
        fetch(`${API_URL}/api/catalog/products${query}`),
        fetch(`${API_URL}/api/catalog/pizza-extras`),
      ]);

      const [catData, prodData, extrasData] = await Promise.all([
        catRes.json(),
        prodRes.json(),
        extrasRes.json(),
      ]);

      if (catData.categories) setCategories(catData.categories);
      if (prodData.products) setMenuItems(prodData.products);
      if (extrasData.pizza_extras) setExtrasState(extrasData.pizza_extras);

    } catch (err) {
      console.error('Failed to load menu data from backend:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  return (
    <MenuContext.Provider value={{ categories, menuItems, extras, isLoading, refreshMenu: fetchCatalog }}>
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
