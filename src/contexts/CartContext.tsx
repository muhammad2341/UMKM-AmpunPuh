import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Product } from "../types";

interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

interface Order {
  id: string;
  storeId: string;
  storeName: string;
  items: CartItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "ready" | "completed" | "cancelled";
  pickupTime?: string;
  createdAt: string;
  paymentProof?: string;
}

interface CartContextType {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, notes?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  
  // Favorites
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  
  // Orders
  orders: Order[];
  createOrder: (storeId: string, storeName: string, items: CartItem[], pickupTime?: string) => string;
  getOrderById: (orderId: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  uploadPaymentProof: (orderId: string, proofUrl: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("umkm_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [favorites, setFavorites] = useState<Product[]>(() => {
    const saved = localStorage.getItem("umkm_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("umkm_orders");
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("umkm_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("umkm_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("umkm_orders", JSON.stringify(orders));
  }, [orders]);

  // Cart functions
  const addToCart = (product: Product, quantity = 1, notes = "") => {
    // Prevent adding food/beverage to cart
    if (product.category === "Makanan" || product.category === "Minuman") {
      alert("Produk makanan dan minuman tidak bisa dipesan online. Silakan pesan langsung via WhatsApp atau datang ke toko.");
      return;
    }
    
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity, notes }
            : item
        );
      }
      return [...prev, { product, quantity, notes }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Favorites functions
  const addToFavorites = (product: Product) => {
    setFavorites((prev) => {
      if (prev.find((p) => p.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromFavorites = (productId: string) => {
    setFavorites((prev) => prev.filter((p) => p.id !== productId));
  };

  const isFavorite = (productId: string) => {
    return favorites.some((p) => p.id === productId);
  };

  // Orders functions
  const createOrder = (storeId: string, storeName: string, items: CartItem[], pickupTime?: string): string => {
    const orderId = `ORD-${Date.now()}`;
    const totalAmount = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    
    const newOrder: Order = {
      id: orderId,
      storeId,
      storeName,
      items,
      totalAmount,
      status: "pending",
      pickupTime,
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    return orderId;
  };

  const getOrderById = (orderId: string) => {
    return orders.find((order) => order.id === orderId);
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const uploadPaymentProof = (orderId: string, proofUrl: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, paymentProof: proofUrl, status: "confirmed" } : order
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        orders,
        createOrder,
        getOrderById,
        updateOrderStatus,
        uploadPaymentProof,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
