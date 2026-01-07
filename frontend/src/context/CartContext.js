"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';

import axios from 'axios';
import toast from 'react-hot-toast';

import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const syncTimeoutRef = useRef(null);
  const lastSyncRef = useRef(Date.now());

  // Sync cart with server periodically
  const syncCart = useCallback(async () => {
    if (!user || isLoading) return;
    
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart`
      );
      setCart(res.data);
      lastSyncRef.current = Date.now();
    } catch (err) {
      console.error("Error syncing cart:", err);
    }
  }, [user, isLoading]);

  useEffect(() => {
    const loadCart = async () => {
      if (!user) {
        setCart([]);
        return;
      }
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cart`
        );
        setCart(res.data);
        lastSyncRef.current = Date.now();
      } catch (err) {
        console.error("Error loading cart:", err);
        setCart([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadCart();

    // Set up periodic sync every 30 seconds
    const interval = setInterval(syncCart, 30000);
    return () => clearInterval(interval);
  }, [user, syncCart]);

  const addToCart = async (product) => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    // Store original state for rollback
    const originalCart = [...cart];
    const transactionId = Date.now().toString();
    
    // Optimistic update with transaction tracking
    const existingItem = cart.find(item => item.productId === product._id);
    if (existingItem) {
      setCart(prev => prev.map(item => 
        item.productId === product._id 
          ? { ...item, qty: item.qty + 1, _transactionId: transactionId }
          : item
      ));
    } else {
      setCart(prev => [...prev, {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: 1,
        _transactionId: transactionId
      }]);
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart/add`,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          transactionId
        }
      );
      
      // Atomic update - replace entire cart state
      setCart(res.data.map(item => ({ ...item, _transactionId: null })));
      toast.success('Added to cart!');
    } catch (err) {
      // Rollback transaction
      setCart(originalCart);
      toast.error(err.response?.data?.error || 'Transaction failed - changes rolled back');
      console.error('Cart transaction failed:', err);
    }
  };

  const updateCartItem = async (productId, qty) => {
    if (!user) return;

    // Store original state for rollback
    const originalCart = [...cart];
    const transactionId = Date.now().toString();
    
    // Optimistic update with transaction tracking
    setCart(prev => prev.map(item => 
      item.productId === productId 
        ? { ...item, qty, _transactionId: transactionId } 
        : item
    ));

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart/item/${productId}`,
        { qty, transactionId }
      );
      
      // Atomic update - replace entire cart state
      setCart(res.data.map(item => ({ ...item, _transactionId: null })));
    } catch (err) {
      // Rollback transaction
      setCart(originalCart);
      toast.error(err.response?.data?.error || 'Update failed - changes rolled back');
      console.error('Cart update transaction failed:', err);
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return;

    // Store original state for rollback
    const originalCart = [...cart];
    const transactionId = Date.now().toString();
    
    // Optimistic update with transaction tracking
    setCart(prev => prev.filter(item => item.productId !== productId));

    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart/item/${productId}`,
        { data: { transactionId } }
      );
      
      // Atomic update - replace entire cart state
      setCart(res.data.map(item => ({ ...item, _transactionId: null })));
      toast.success('Removed from cart');
    } catch (err) {
      // Rollback transaction
      setCart(originalCart);
      toast.error(err.response?.data?.error || 'Remove failed - changes rolled back');
      console.error('Cart remove transaction failed:', err);
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const subTotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const gst = subTotal * 0.18;
  const total = subTotal + gst;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        cartCount,
        subTotal,
        gst,
        total,
        isLoading,
        syncCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
