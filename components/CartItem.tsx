import { useCartItemDisplay } from "@/hooks/useCartItemDisplay";
import { useCartItemVariant } from "@/hooks/useCartItemVariant";
import { ApiProduct } from "@/types/api";
import React from "react";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import { CartOptions } from "./ProductOptionsModal";

interface CartItemProps {
  item: ApiProduct;
  options: CartOptions;
  onUpdateQuantity: (newQuantity: number) => void;
  onRemove: () => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  options,
  onUpdateQuantity,
  onRemove,
}) => {
  const displayOptions = useCartItemDisplay(item._id, options.selectedOptions);

  const variantInfo = useCartItemVariant(item._id, options.selectedVariant);

  const calculateTotalPrice = () => {
    const basePrice = variantInfo ? variantInfo.price : 0;

    let totalPriceIncrease = 0;
    displayOptions.forEach((opt) => {
      totalPriceIncrease += opt.priceIncrease;
    });
    return (basePrice + totalPriceIncrease) * options.quantity;
  };

  const totalPrice = calculateTotalPrice();

  const handleIncrease = () => {
    onUpdateQuantity(options.quantity + 1);
  };

  const handleDecrease = () => {
    if (options.quantity > 1) {
      onUpdateQuantity(options.quantity - 1);
    }
  };

  return (
    <View className='bg-white mx-4 mb-3 rounded-2xl p-4 shadow-sm border border-gray-100'>
      <View className='flex-row justify-center items-center'>
        {/* Product Image */}
        <Image
          source={{ uri: item.imageUrl }}
          className='size-24 rounded-xl'
          resizeMode='contain'
        />

        {/* Product Details */}
        <View className='flex-1 ml-4'>
          {/* Product Name & Remove Button */}
          <View className='flex-row justify-between items-start mb-2'>
            <Text
              className='text-lg font-bold text-gray-800 flex-1'
              numberOfLines={2}
            >
              {item.name}
            </Text>
            <TouchableOpacity onPress={onRemove} className='ml-2 p-1'>
              <Text className='text-red-500 font-medium'>Xóa</Text>
            </TouchableOpacity>
          </View>

          {/* Variant (Size) */}
          {variantInfo && (
            <View className='mb-1'>
              <Text className='text-sm text-gray-600'>
                Size:{" "}
                <Text className='font-medium text-gray-800'>
                  {variantInfo.name}
                </Text>
              </Text>
            </View>
          )}

          {/* Options */}
          <View className='mb-3'>
            {displayOptions.map((optGroup, index) => (
              <View key={index} className='mb-1'>
                <Text className='text-sm text-gray-600'>
                  {optGroup.groupName}:{" "}
                  <Text className='font-medium text-gray-800'>
                    {optGroup.optionNames.join(", ")}
                  </Text>
                  {optGroup.priceIncrease > 0 && (
                    <Text className='text-xs text-green-600'>
                      {" "}
                      (+{optGroup.priceIncrease.toLocaleString("vi-VN")}đ)
                    </Text>
                  )}
                </Text>
              </View>
            ))}
          </View>

          {/* Price & Quantity Controls */}
          <View className='flex-row justify-between items-center'>
            {/* Price */}
            <Text className='text-lg font-bold text-primary'>
              {totalPrice.toLocaleString("vi-VN")}đ
            </Text>

            {/* Quantity Controls */}
            <View className='flex-row items-center'>
              <Pressable
                onPress={handleDecrease}
                className='w-8 h-8 rounded-full border-2 border-gray-200 items-center justify-center'
              >
                <Text className='text-lg font-bold text-gray-600'>−</Text>
              </Pressable>

              <Text className='mx-4 text-lg font-bold text-gray-800'>
                {options.quantity}
              </Text>

              <Pressable
                onPress={handleIncrease}
                className='w-8 h-8 rounded-full border-2 border-primary items-center justify-center bg-primary/10'
              >
                <Text className='text-lg font-bold text-primary'>+</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CartItem;
