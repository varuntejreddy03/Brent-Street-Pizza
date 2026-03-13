import React, { createContext, useContext, useState, useEffect } from 'react';
import { CATEGORIES as dummyCategories, MENU_ITEMS as dummyItems, PIZZA_EXTRAS as dummyExtras } from '../data/dummyMenuData';
import type { MenuItem, MenuCategory, ExtraCategory } from '../types/menu';

interface MenuContextType {
  categories: MenuCategory[];
  menuItems: MenuItem[];
  extras: ExtraCategory[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  saveExtras: (extras: ExtraCategory[]) => void;
  isAdmin: boolean;
  loginNode: () => void;
  logoutNode: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [extras, setExtrasState] = useState<ExtraCategory[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Load from localStorage or fallback to dummy
    const storedItems = localStorage.getItem('MENU_ITEMS');
    const storedCategories = localStorage.getItem('CATEGORIES');
    const storedExtras = localStorage.getItem('PIZZA_EXTRAS');
    const storedAdmin = localStorage.getItem('IS_ADMIN');

    if (storedItems) {
      setMenuItems(JSON.parse(storedItems));
    } else {
      setMenuItems(dummyItems);
      localStorage.setItem('MENU_ITEMS', JSON.stringify(dummyItems));
    }

    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      setCategories(dummyCategories);
      localStorage.setItem('CATEGORIES', JSON.stringify(dummyCategories));
    }

    if (storedExtras) {
      setExtrasState(JSON.parse(storedExtras));
    } else {
      setExtrasState(dummyExtras);
      localStorage.setItem('PIZZA_EXTRAS', JSON.stringify(dummyExtras));
    }

    if (storedAdmin === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const saveItems = (items: MenuItem[]) => {
    setMenuItems(items);
    localStorage.setItem('MENU_ITEMS', JSON.stringify(items));
  };

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem = { ...item, id: `item-${Date.now()}` };
    saveItems([...menuItems, newItem as MenuItem]);
  };

  const updateMenuItem = (id: string, updatedFields: Partial<MenuItem>) => {
    const updatedItems = menuItems.map(item =>
      item.id === id ? { ...item, ...updatedFields } : item
    );
    saveItems(updatedItems);
  };

  const deleteMenuItem = (id: string) => {
    const updatedItems = menuItems.filter(item => item.id !== id);
    saveItems(updatedItems);
  };

  const saveExtras = (newExtras: ExtraCategory[]) => {
    setExtrasState(newExtras);
    localStorage.setItem('PIZZA_EXTRAS', JSON.stringify(newExtras));
  };

  const loginNode = () => {
    setIsAdmin(true);
    localStorage.setItem('IS_ADMIN', 'true');
  };

  const logoutNode = () => {
    setIsAdmin(false);
    localStorage.removeItem('IS_ADMIN');
  };

  return (
    <MenuContext.Provider value={{ categories, menuItems, extras, addMenuItem, updateMenuItem, deleteMenuItem, saveExtras, isAdmin, loginNode, logoutNode }}>
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
