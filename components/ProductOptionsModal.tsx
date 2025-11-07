import {
  OptionsGroup,
  ProductOption,
  ProductVariant,
  useProductOptions,
} from "@/hooks/useProductOptions";
import { ApiProduct } from "@/types/api";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ProductOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  item: ApiProduct;
  onAddToCart: (options: CartOptions) => void;
}

export interface CartOptions {
  selectedVariant?: string; // ID của variant được chọn
  selectedOptions: { [groupId: string]: string | string[] }; // single -> string, multi -> string[]
  quantity: number;
}

const ProductOptionsModal: React.FC<ProductOptionsModalProps> = ({
  visible,
  onClose,
  item,
  onAddToCart,
}) => {
  const { options, variants, loading, error, fetchOptions } = useProductOptions(
    item._id
  );
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<{
    [groupId: string]: string | string[];
  }>({});
  const [quantity, setQuantity] = useState(1);

  // Fetch data khi modal mở, reset khi đóng
  useEffect(() => {
    if (visible) {
      fetchOptions();
    } else {
      // Reset state khi modal đóng
      setSelectedVariant("");
      setSelectedOptions({});
      setQuantity(1);
    }
  }, [visible, fetchOptions]);

  // Reset khi modal mở và data đã được load
  useEffect(() => {
    if (visible) {
      // Set default variant
      if (variants && variants.length > 0) {
        const defaultVariant = variants.find((v) => v.isDefault) || variants[0];
        setSelectedVariant(defaultVariant._id);
      }

      // Set default options
      if (options && Array.isArray(options) && options.length > 0) {
        const defaultSelections: { [groupId: string]: string | string[] } = {};

        options.forEach((group: OptionsGroup) => {
          if (group.uiType === "single") {
            const defaultOption =
              group.options.find((opt) => opt.isDefault) || group.options[0];
            if (defaultOption) {
              defaultSelections[group._id] = defaultOption._id;
            }
          }
        });

        setSelectedOptions(defaultSelections);
      }

      setQuantity(1);
    }
  }, [visible, options, variants]);

  const handleAddToCart = () => {
    onAddToCart({
      selectedVariant,
      selectedOptions,
      quantity,
    });
    onClose();
  };

  // Tính tổng giá dựa trên variant và options được chọn
  const calculateTotalPrice = () => {
    let basePrice = 0;
    if (variants && selectedVariant) {
      const variant = variants.find((v) => v._id === selectedVariant);
      if (variant) {
        basePrice = variant.price;
      }
    }

    if (options && Array.isArray(options)) {
      options.forEach((group: OptionsGroup) => {
        const selectedValue = selectedOptions[group._id];

        if (selectedValue) {
          if (group.uiType === "single" && typeof selectedValue === "string") {
            // Single selection
            const selectedOption = group.options.find(
              (opt) => opt._id === selectedValue
            );
            if (selectedOption) {
              basePrice += selectedOption.priceDelta;
            }
          } else if (group.uiType === "multi" && Array.isArray(selectedValue)) {
            // Multiple selection
            selectedValue.forEach((optionId) => {
              const selectedOption = group.options.find(
                (opt) => opt._id === optionId
              );
              if (selectedOption) {
                basePrice += selectedOption.priceDelta;
              }
            });
          }
        }
      });
    }

    return basePrice * quantity;
  };
  const totalPrice = calculateTotalPrice();

  return (
    <Modal
      visible={visible}
      transparent
      animationType='slide'
      onRequestClose={onClose}
    >
      <View className='flex-1 bg-black/50 justify-end'>
        <View className='bg-white rounded-t-3xl h-[80%]'>
          {/* Header */}
          <View className='flex-row items-center justify-between p-5 border-b border-gray-100'>
            <Text className='text-lg font-bold text-gray-800'>
              Tùy chỉnh đồ uống
            </Text>
            <TouchableOpacity onPress={onClose} className='p-2'>
              <Text className='text-2xl text-gray-400 font-bold'>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            className='flex-1'
            contentContainerStyle={{ paddingBottom: 80 }} // Increased padding for button
            showsVerticalScrollIndicator={false}
            bounces={true}
            keyboardShouldPersistTaps='handled'
          >
            {/* Product Info */}
            <View className='items-center py-5 border-b border-gray-100'>
              <Image
                source={item.imageUrl ? { uri: item.imageUrl } : undefined}
                className='size-32 mb-3'
                resizeMode='contain'
              />
              <Text className='text-xl font-bold text-gray-800 mb-1'>
                {item.name}
              </Text>
              <Text className='text-sm text-gray-500 text-center'>
                {item.description}
              </Text>
            </View>

            {/* Size Selection */}
            {variants && variants.length > 0 && (
              <View className='p-4 border-b border-gray-100'>
                <Text className='text-base font-bold text-gray-800 mb-3'>
                  Size
                </Text>
                <View className='flex-row flex-wrap gap-2'>
                  {variants.map((variant: ProductVariant) => (
                    <Pressable
                      key={variant._id}
                      onPress={() => setSelectedVariant(variant._id)}
                      className={`px-4 py-2 rounded-full border-2 ${
                        selectedVariant === variant._id
                          ? "bg-primary border-primary"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      <Text
                        className={`text-sm ${
                          selectedVariant === variant._id
                            ? "text-white font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        {variant.name} ({variant.price.toLocaleString("vi-VN")}
                        đ)
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {/* Loading State */}
            {loading && (
              <View className='p-8 items-center'>
                <ActivityIndicator size='large' color='#315c41' />
                <Text className='mt-2 text-gray-600'>Đang tải tùy chọn...</Text>
              </View>
            )}

            {/* Error State */}
            {error && (
              <View className='p-4 bg-red-50 border border-red-200 mx-4 my-2 rounded-lg'>
                <Text className='text-red-600 text-center'>
                  Không thể tải tùy chọn: {error}
                </Text>
              </View>
            )}

            {/* Dynamic Options Groups */}
            {!loading &&
              !error &&
              options &&
              Array.isArray(options) &&
              options.map((group: OptionsGroup) => (
                <View key={group._id} className='p-4 border-b border-gray-100'>
                  <View className='flex-row items-center mb-3'>
                    <Text className='text-base font-bold text-gray-800'>
                      {group.name}
                    </Text>
                    {group.required && (
                      <Text className='text-red-500 text-xs ml-2'>*</Text>
                    )}
                  </View>

                  <View className='flex-row flex-wrap'>
                    {group.options
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .map((option: ProductOption) => {
                        // Check if option is selected for both single and multi
                        const selectedValue = selectedOptions[group._id];
                        const isSelected =
                          group.uiType === "single"
                            ? selectedValue === option._id
                            : Array.isArray(selectedValue) &&
                              selectedValue.includes(option._id);

                        return (
                          <View
                            key={option._id}
                            className={`mr-2 mb-2 rounded-2xl border-2 ${
                              isSelected
                                ? "border-primary bg-primary/10"
                                : "border-gray-200 bg-white"
                            }`}
                          >
                            <Pressable
                              onPress={() => {
                                if (group.uiType === "single") {
                                  // Single selection (radio)
                                  setSelectedOptions((prev) => ({
                                    ...prev,
                                    [group._id]: option._id,
                                  }));
                                } else if (group.uiType === "multi") {
                                  // Multiple selection (checkbox)
                                  setSelectedOptions((prev) => {
                                    const currentSelected =
                                      (prev[group._id] as string[]) || [];
                                    const newSelected = isSelected
                                      ? currentSelected.filter(
                                          (id) => id !== option._id
                                        ) // Remove if already selected
                                      : [...currentSelected, option._id]; // Add if not selected

                                    return {
                                      ...prev,
                                      [group._id]: newSelected,
                                    };
                                  });
                                }
                              }}
                              className='px-3 py-1.5'
                            >
                              <Text
                                className={`font-medium text-sm ${
                                  isSelected ? "text-primary" : "text-gray-600"
                                }`}
                              >
                                {option.name}
                                {option.priceDelta > 0 && (
                                  <Text className='text-xs'>
                                    {` (+${option.priceDelta.toLocaleString("vi-VN")}đ)`}
                                  </Text>
                                )}
                              </Text>
                            </Pressable>
                          </View>
                        );
                      })}
                  </View>
                </View>
              ))}

            {/* Quantity */}
            <View className='p-4 pb-8'>
              <Text className='text-base font-bold text-gray-800 mb-3'>
                Số lượng
              </Text>
              <View className='flex-row items-center justify-center'>
                <Pressable
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                  className='w-10 h-10 rounded-full border-2 border-gray-200 items-center justify-center'
                >
                  <Text className='text-lg font-bold text-gray-600'>−</Text>
                </Pressable>

                <Text className='mx-6 text-xl font-bold text-gray-800'>
                  {quantity}
                </Text>

                <Pressable
                  onPress={() => setQuantity(quantity + 1)}
                  className='w-10 h-10 rounded-full border-2 border-primary items-center justify-center bg-primary/10'
                >
                  <Text className='text-lg font-bold text-primary'>+</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>

          {/* Add to Cart Button - Fixed at bottom */}
          <View className='absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-100'>
            <TouchableOpacity
              onPress={handleAddToCart}
              className='bg-primary rounded-2xl py-4 flex-row items-center justify-center'
            >
              <Text className='text-white font-bold text-lg mr-2'>
                Thêm vào giỏ hàng
              </Text>
              <Text className='text-white font-bold text-lg'>
                {totalPrice.toLocaleString("vi-VN")}đ
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ProductOptionsModal;
