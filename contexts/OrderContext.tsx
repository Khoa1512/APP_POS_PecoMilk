import { PaymentMethod } from "@/components/PaymentMethodModal";
import { API_CONFIG } from "@/config/api";
import { Order, OrderItem } from "@/types/order";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { CartItemData } from "./CartContext";

interface OrderContextType {
  orders: Order[];
  addOrder: (
    items: CartItemData[],
    paymentMethod: PaymentMethod
  ) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  getOrdersByStatus: (status: Order["status"]) => Order[];
  getTotalOrders: () => number;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const calculateItemPrice = async (
    cartItem: CartItemData
  ): Promise<number> => {
    try {
      const response = await fetch(
        `${API_CONFIG.baseURL}/api/products/${cartItem.item._id}/with-options`
      );

      if (response.ok) {
        const data = await response.json();
        let basePrice = 0;

        // Tìm giá từ variant được chọn
        if (cartItem.options.selectedVariant && data.data.variants) {
          const selectedVariant = data.data.variants.find(
            (v: any) => v._id === cartItem.options.selectedVariant
          );
          if (selectedVariant) {
            basePrice = selectedVariant.price;
          }
        }

        // Tính giá options
        let optionsPrice = 0;
        if (data.data.optionGroups && cartItem.options.selectedOptions) {
          data.data.optionGroups.forEach((group: any) => {
            const selectedValue = cartItem.options.selectedOptions[group._id];

            if (selectedValue) {
              if (Array.isArray(selectedValue)) {
                // Multi-select options
                selectedValue.forEach((optionId) => {
                  const option = group.options.find(
                    (opt: any) => opt._id === optionId
                  );
                  if (option) {
                    optionsPrice += option.priceDelta;
                  }
                });
              } else {
                // Single-select options
                const option = group.options.find(
                  (opt: any) => opt._id === selectedValue
                );
                if (option) {
                  optionsPrice += option.priceDelta;
                }
              }
            }
          });
        }

        return (basePrice + optionsPrice) * cartItem.options.quantity;
      }
    } catch (error) {
      console.error("Error calculating item price:", error);
    }
    return 0;
  };

  const addOrder = async (
    items: CartItemData[],
    paymentMethod: PaymentMethod
  ) => {
    const orderId = `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const orderItems: OrderItem[] = await Promise.all(
      items.map(async (cartItem) => {
        const itemPrice = await calculateItemPrice(cartItem);
        return {
          id: `orderitem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          product: cartItem.item,
          selectedVariant: cartItem.options.selectedVariant,
          selectedOptions: cartItem.options.selectedOptions,
          quantity: cartItem.options.quantity,
          price: itemPrice / cartItem.options.quantity, 
        };
      })
    );

    // Calculate total amount
    const totalAmount = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const newOrder: Order = {
      id: orderId,
      items: orderItems,
      totalAmount,
      paymentMethod,
      status: "preparing",
      createdAt: new Date(),
    };

    setOrders((prevOrders) => [newOrder, ...prevOrders]);
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const getOrdersByStatus = (status: Order["status"]) => {
    return orders.filter((order) => order.status === status);
  };

  const getTotalOrders = () => {
    return orders.length;
  };

  const value: OrderContextType = {
    orders,
    addOrder,
    updateOrderStatus,
    getOrdersByStatus,
    getTotalOrders,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};
