import { useCart } from "@/contexts/CartContext";
import { ApiProduct } from "@/types/api";
import { useState } from "react";
import { Image, Platform, Text, TouchableOpacity, View } from "react-native";
import ProductOptionsModal, { CartOptions } from "./ProductOptionsModal";

const MenuCart = ({ item }: { item: ApiProduct }) => {
  const [showModal, setShowModal] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (options: CartOptions) => {
    addToCart(item, options);
  };

  const openModal = () => {
    setShowModal(true);
  };

  return (
    <>
      <View
        className='relative py-6 px-3.5 pt-24 flex items-center justify-end bg-white shadow-md shadow-black/10 rounded-3xl'
        style={
          Platform.OS === "android"
            ? { elevation: 10, shadowColor: "#878787" }
            : {}
        }
      >
        {item.imageUrl && (
          <Image
            source={{ uri: item.imageUrl }}
            className='size-32 absolute -top-8'
            resizeMode='contain'
          />
        )}

        <Text
          className='text-center text-base font-bold text-gray-800 mb-2'
          numberOfLines={1}
        >
          {item.name}
        </Text>

        <Text
          className='text-center text-xs text-gray-500 mb-3 leading-4'
          numberOfLines={2}
        >
          {item.description}
        </Text>

        {/* Giá sẽ hiển thị trong modal theo variants */}

        <TouchableOpacity
          onPress={openModal}
          className='bg-gray-100 border-2 border-gray-200 rounded-2xl px-4 py-2 w-full flex-row items-center justify-center'
          activeOpacity={0.7}
        >
          <Text className='text-gray-700 font-medium text-sm mr-1'>
            Tùy chọn
          </Text>
        </TouchableOpacity>
      </View>

      <ProductOptionsModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        item={item}
        onAddToCart={handleAddToCart}
      />
    </>
  );
};

export default MenuCart;
