import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();

  const userId = useMemo(() => (user?.id || user?._id || null), [user]);
  const getStorageKey = (id) => id ? `cart:${id}` : 'cart:guest';

  // Load cart from localStorage on app start
  useEffect(() => {
    const savedCart = localStorage.getItem(getStorageKey(null));
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(cart));
  }, [cart, userId]);

  // Sync cart with server when user logs in
  useEffect(() => {
    const handleAuthChange = async () => {
      if (user && token && userId) {
        // Load user's own local cart (do not merge guest cart)
        const userCartRaw = localStorage.getItem(getStorageKey(userId));
        const userLocalCart = userCartRaw ? JSON.parse(userCartRaw) : { items: [], total: 0 };
        setCart(userLocalCart);
        await syncCartWithServer(userLocalCart);
      } else {
        // On logout: avoid leaking previous user's cart into guest
        setCart({ items: [], total: 0 });
      }
    };

    handleAuthChange();
  }, [user, token, userId]);

  const syncCartWithServer = async (localBaselineCart = cart) => {
    try {
      setLoading(true);
      const response = await axios.get('/api/cart');
      const serverCart = response.data;
      
      // Merge local cart with server cart
      const mergedCart = mergeCarts(localBaselineCart, serverCart);
      setCart(mergedCart);
      
      // Update server cart
      await updateServerCart(mergedCart);
    } catch (error) {
      console.error('Error syncing cart with server:', error);
    } finally {
      setLoading(false);
    }
  };

  const mergeCarts = (localCart, serverCart) => {
    const mergedItems = [...serverCart.items];
    
    // Add items from local cart that don't exist in server cart
    localCart.items.forEach(localItem => {
      const existingItem = mergedItems.find(
        item => item.item._id === localItem.item._id || item.item === localItem.item._id
      );
      
      if (existingItem) {
        // Use the higher quantity
        existingItem.quantity = Math.max(existingItem.quantity, localItem.quantity);
      } else {
        // Add new item
        mergedItems.push(localItem);
      }
    });
    
    return { ...serverCart, items: mergedItems };
  };

  const updateServerCart = async (cartData) => {
    if (!user || !token) return;
    
    try {
      // Clear server cart first
      await axios.delete('/api/cart/clear');
      
      // Add all items to server cart
      for (const cartItem of cartData.items) {
        await axios.post('/api/cart/add', {
          itemId: cartItem.item._id || cartItem.item,
          quantity: cartItem.quantity
        });
      }
    } catch (error) {
      console.error('Error updating server cart:', error);
    }
  };

  const addToCart = async (item, quantity = 1) => {
    try {
      setLoading(true);
      
      const existingItemIndex = cart.items.findIndex(
        cartItem => (cartItem.item._id || cartItem.item) === item._id
      );

      let updatedCart;
      if (existingItemIndex > -1) {
        // Update existing item quantity
        const updatedItems = [...cart.items];
        updatedItems[existingItemIndex].quantity += quantity;
        updatedCart = { ...cart, items: updatedItems };
      } else {
        // Add new item
        const newItem = { item, quantity };
        updatedCart = { ...cart, items: [...cart.items, newItem] };
      }

      setCart(updatedCart);

      // Update server if user is logged in
      if (user && token) {
        await axios.post('/api/cart/add', {
          itemId: item._id,
          quantity
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      setLoading(true);
      
      const updatedItems = cart.items.filter(
        cartItem => (cartItem.item._id || cartItem.item) !== itemId
      );
      const updatedCart = { ...cart, items: updatedItems };
      setCart(updatedCart);

      // Update server if user is logged in
      if (user && token) {
        await axios.delete('/api/cart/remove', {
          data: { itemId }
        });
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      setLoading(true);
      
      if (quantity <= 0) {
        await removeFromCart(itemId);
        return;
      }

      const updatedItems = cart.items.map(cartItem =>
        (cartItem.item._id || cartItem.item) === itemId
          ? { ...cartItem, quantity }
          : cartItem
      );
      const updatedCart = { ...cart, items: updatedItems };
      setCart(updatedCart);

      // Update server if user is logged in
      if (user && token) {
        await axios.put('/api/cart/update', {
          itemId,
          quantity
        });
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      setCart({ items: [], total: 0 });

      // Clear server cart if user is logged in
      if (user && token) {
        await axios.delete('/api/cart/clear');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCartItemCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.items.reduce((total, item) => {
      const price = item.item.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemCount,
    getCartTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

