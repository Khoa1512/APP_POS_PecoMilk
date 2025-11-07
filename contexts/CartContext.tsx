import { CartOptions } from "@/components/ProductOptionsModal";
import { useCartTotal } from "@/hooks/useCartTotal";
import { ApiProduct } from "@/types/api";
import React, { createContext, ReactNode, useContext, useState } from "react";

// Interface cho cart item
export interface CartItemData {
  id: string;
  item: ApiProduct;
  options: CartOptions;
}

// Interface cho CartContext
interface CartContextType {
  cartItems: CartItemData[];
  addToCart: (item: ApiProduct, options: CartOptions) => void;
  updateQuantity: (id: string, newQuantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

// Tạo Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const { totalPrice } = useCartTotal(cartItems);

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = (item: ApiProduct, options: CartOptions) => {
    const cartItemId = `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newCartItem: CartItemData = {
      id: cartItemId,
      item,
      options,
    };

    setCartItems((prevItems) => [...prevItems, newCartItem]);
  };

  // Cập nhật số lượng
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((cartItem) =>
        cartItem.id === id
          ? {
              ...cartItem,
              options: { ...cartItem.options, quantity: newQuantity },
            }
          : cartItem
      )
    );
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (id: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((cartItem) => cartItem.id !== id)
    );
  };

  // Xóa toàn bộ giỏ hàng
  const clearCart = () => {
    setCartItems([]);
  };

  // Tính tổng số lượng items
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.options.quantity, 0);
  };

  // Tính tổng tiền từ database
  const getTotalPrice = () => {
    return totalPrice;
  };

  const value: CartContextType = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Hook để sử dụng CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
