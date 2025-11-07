import icons from "@/constants/icons";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const CartButton = () => {
  const router = useRouter();
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <TouchableOpacity
      onPress={() => router.push("/(screens)/cart")}
      className='flex size-10 bg-primary justify-center items-center rounded-full relative'
    >
      <Image source={icons.bag} className='size-5' resizeMode='contain' />
      {totalItems > 0 && (
        <View className='absolute -top-1 -right-1 bg-red-500 rounded-full min-w-5 h-5 flex items-center justify-center'>
          <Text className='text-white text-xs font-bold'>
            {totalItems > 99 ? "99+" : totalItems}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CartButton;
