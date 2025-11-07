import { API_CONFIG } from "@/config/api";
import { CartItemData } from "@/contexts/CartContext";
import { useEffect, useState } from "react";

export const useCartTotal = (cartItems: CartItemData[]) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const calculateTotal = async () => {
      if (cartItems.length === 0) {
        setTotalPrice(0);
        return;
      }

      setLoading(true);
      let total = 0;

      try {
        for (const cartItem of cartItems) {
          // Fetch variant và options data cho từng item
          const url = `${API_CONFIG.baseURL}/api/products/${cartItem.item._id}/with-options`;

          const response = await fetch(url);
          
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
                const selectedValue =
                  cartItem.options.selectedOptions[group._id];

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

            const itemTotal =
              (basePrice + optionsPrice) * cartItem.options.quantity;
            total += itemTotal;

            console.log(
              `Item: ${cartItem.item.name}, Base: ${basePrice}, Options: ${optionsPrice}, Quantity: ${cartItem.options.quantity}, Total: ${itemTotal}`
            );
          } else {
            console.error(
              "Failed to fetch product data:",
              response.status,
              response.statusText
            );
          }
        }
      } catch (error) {
        console.error("Error calculating cart total:", error);
      }

      console.log("Final total price:", total);
      setTotalPrice(total);
      setLoading(false);
    };

    calculateTotal();
  }, [cartItems]);

  return { totalPrice, loading };
};
