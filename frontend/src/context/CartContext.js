"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import axios from 'axios';

import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const loadCart = async () => {
      if (!user) {
        setCart([]);
        return;
      }
      try {
        const res = await axios.get(`${process.env.NEXT_API_URL}/api/cart`);
        setCart(res.data);
      } catch (err) {
        console.error("Error loading cart:", err);
        setCart([]);
      }
    };
    loadCart();
  }, [user]);

  const addToCart = async (product) => {
    if (!user) {
      alert("Please login to add items to cart");
      return;
    }

    try {
      const res = await axios.post(`${process.env.NEXT_API_URL}/api/cart/add`, {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
      setCart(res.data);
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const updateCartItem = async (productId, qty) => {
    if (!user) return;

    try {
      const res = await axios.put(
        `${process.env.NEXT_API_URL}/api/cart/item/${productId}`,
        {
          qty,
        }
      );
      setCart(res.data);
    } catch (err) {
      console.error("Error updating cart item:", err);
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return;

    try {
      const res = await axios.delete(
        `${process.env.NEXT_API_URL}/api/cart/item/${productId}`
      );
      setCart(res.data);
    } catch (err) {
      console.error("Error removing from cart:", err);
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
