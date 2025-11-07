import CartItem from "@/components/CartItem";
import { API_CONFIG } from "@/config/api";
import icons from "@/constants/icons";
import { useCart } from "@/contexts/CartContext";
import OrderAPI, { CreateOrderPayload } from "@/services/orderAPI";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CartPage = () => {
  const router = useRouter();

  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    clearCart,
  } = useCart();

  const convertCartItemsToOrderPayload =
    async (): Promise<CreateOrderPayload> => {
      const orderItems = [];

      for (const cartItem of cartItems) {
        const response = await fetch(
          `${API_CONFIG.baseURL}/api/products/${cartItem.item._id}/with-options`
        );

        if (response.ok) {
          const productData = await response.json();

          let basePrice = 0;
          let variantInfo = null;

          if (cartItem.options.selectedVariant && productData.data.variants) {
            variantInfo = productData.data.variants.find(
              (v: any) => v._id === cartItem.options.selectedVariant
            );
            if (variantInfo) {
              basePrice = variantInfo.price;
            }
          }

          const options = [];
          if (
            productData.data.optionGroups &&
            cartItem.options.selectedOptions
          ) {
            for (const [groupId, selectedValue] of Object.entries(
              cartItem.options.selectedOptions
            )) {
              const group = productData.data.optionGroups.find(
                (g: any) => g._id === groupId
              );
              if (group) {
                if (Array.isArray(selectedValue)) {
                  for (const optionId of selectedValue) {
                    const option = group.options.find(
                      (o: any) => o._id === optionId
                    );
                    if (option) {
                      options.push({
                        optionGroupId: groupId,
                        optionGroupName: group.name,
                        optionId: optionId,
                        optionName: option.name,
                        priceDelta: option.priceDelta,
                      });
                    }
                  }
                } else {
                  // Single-select
                  const option = group.options.find(
                    (o: any) => o._id === selectedValue
                  );
                  if (option) {
                    options.push({
                      optionGroupId: groupId,
                      optionGroupName: group.name,
                      optionId: selectedValue as string,
                      optionName: option.name,
                      priceDelta: option.priceDelta,
                    });
                  }
                }
              }
            }
          }

          const optionsTotal = options.reduce(
            (sum, opt) => sum + opt.priceDelta,
            0
          );
          const lineTotal =
            (basePrice + optionsTotal) * cartItem.options.quantity;

          orderItems.push({
            productId: cartItem.item._id,
            productName: cartItem.item.name,
            productImage: cartItem.item.imageUrl,
            variantId: variantInfo?._id,
            variantName: variantInfo?.name,
            basePrice,
            quantity: cartItem.options.quantity,
            options,
            lineTotal,
          });
        }
      }

      const subtotal = orderItems.reduce(
        (sum, item) => sum + item.lineTotal,
        0
      );

      const payload = {
        items: orderItems,
        subtotal,
        discount: 0,
        discountPercent: 0,
        total: subtotal,
        paymentMethod: "cash" as "cash" | "transfer" | "app",
        channel: "POS",
      };
      return payload;
    };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Alert.alert("Giỏ hàng trống", "Vui lòng thêm sản phẩm vào giỏ hàng");
      return;
    }

    try {
      const orderPayload = await convertCartItemsToOrderPayload();
      orderPayload.paymentMethod = "cash";

      // Create order via API
      await OrderAPI.createOrder(orderPayload);

      // Clear cart
      clearCart();

      // Navigate to order tab
      router.push("/(tabs)/order");
    } catch (error) {
      console.error("Error creating order:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.", [
        { text: "OK" },
      ]);
    }
  };

  const renderCartItem = ({ item }: { item: any }) => (
    <CartItem
      item={item.item}
      options={item.options}
      onUpdateQuantity={(newQuantity) => updateQuantity(item.id, newQuantity)}
      onRemove={() => removeFromCart(item.id)}
    />
  );

  return (
    <SafeAreaView className='h-full bg-gray-50'>
      {/* Fixed Header */}
      <View className='px-5 py-7 flex flex-row justify-between items-center bg-white'>
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={icons.arrowback}
            className='size-5'
            resizeMode='contain'
          />
        </TouchableOpacity>
        <Text className='text-xl font-bold text-gray-800'>Giỏ hàng</Text>
        <View className='size-5' />
      </View>

      {/* Cart Content */}
      <View className='flex-1'>
        {cartItems.length > 0 ? (
          <>
            {/* Cart Items List */}
            <FlatList
              data={cartItems}
              renderItem={renderCartItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingTop: 16, paddingBottom: 120 }}
            />

            {/* Total & Checkout - Fixed at bottom */}
            <View className='absolute bottom-0 left-0 right-0 bg-white p-5 border-t border-gray-200'>
              <View className='flex-row justify-between items-center mb-4'>
                <Text className='text-lg font-bold text-gray-800'>
                  Tổng cộng:
                </Text>
                <Text className='text-xl font-bold text-primary'>
                  {getTotalPrice().toLocaleString("vi-VN")}đ
                </Text>
              </View>
              <TouchableOpacity
                className='bg-primary rounded-2xl py-4'
                onPress={handleCheckout}
              >
                <Text className='text-white font-bold text-lg text-center'>
                  Thêm vào đơn hàng
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          /* Empty Cart */
          <View className='flex-1 justify-center items-center px-8'>
            <Image
              source={icons.cart}
              className='size-24 mb-4 opacity-30'
              resizeMode='contain'
            />
            <Text className='text-xl font-bold text-gray-400 mb-2'>
              Giỏ hàng trống
            </Text>
            <Text className='text-gray-500 text-center mb-6'>
              Hãy thêm một số món yêu thích vào giỏ hàng của bạn
            </Text>
            <TouchableOpacity
              onPress={() => router.back()}
              className='bg-primary rounded-2xl px-8 py-3'
            >
              <Text className='text-white font-bold text-base'>
                Tiếp tục mua sắm
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Payment Method Modal */}
    </SafeAreaView>
  );
};

export default CartPage;
