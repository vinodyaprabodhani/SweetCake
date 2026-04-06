import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCart = useCallback(async () => {
    if (!user) {
      // Empty cart state for non-logged-in users
      setItems([]);
      setTotal(0);
      setItemCount(0);
      return;
    }
    try {
      setLoading(true);
      const { data } = await cartAPI.get();
      setItems(data.items);
      setTotal(data.total);
      setItemCount(data.item_count);
    } catch (error) {
      console.error('Fetch cart error:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      // Enforce Account Requirement
      showToast('🔒 You must create an account to order cakes!', 'error');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1800);
      return;
    }
    try {
      await cartAPI.add({ product_id: product.id, quantity });
      await fetchCart();
      showToast(`${product.name} added to cart! 🛒`);
    } catch (error) {
      showToast('Failed to add to cart', 'error');
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!user) return;
    try {
      await cartAPI.updateItem(itemId, { quantity });
      await fetchCart();
    } catch (error) {
      showToast('Failed to update quantity', 'error');
    }
  };

  const removeItem = async (itemId) => {
    if (!user) return;
    try {
      await cartAPI.removeItem(itemId);
      await fetchCart();
      showToast('Item removed from cart');
    } catch (error) {
      showToast('Failed to remove item', 'error');
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      await cartAPI.clear();
      await fetchCart();
    } catch (error) {
      console.error('Clear cart error:', error);
    }
  };

  return (
    <CartContext.Provider value={{ items, total, itemCount, loading, addToCart, updateQuantity, removeItem, clearCart, fetchCart, toast, showToast }}>
      {children}
    </CartContext.Provider>
  );
};
