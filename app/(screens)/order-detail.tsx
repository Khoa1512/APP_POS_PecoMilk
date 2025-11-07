import OrderItemDetail from "@/components/OrderItemDetail";
import icons from "@/constants/icons";
import OrderAPI, { ApiOrder } from "@/services/orderAPI";
import { OrderStatus } from "@/types";
import {
  formatDate,
  getPaymentMethodText,
  getStatusText,
  nextStatusOptions,
} from "@/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const OrderDetailPage = () => {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetail = useCallback(async () => {
    try {
      if (orderId) {
        const orderData = await OrderAPI.getOrderById(orderId);
        setOrder(orderData);
      }
    } catch (error) {
      console.error("Error fetching order detail:", error);
      Alert.alert("Lỗi", "Không thể tải chi tiết đơn hàng");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  const updateOrderStatus = async (newStatus: OrderStatus) => {
    try {
      if (order) {
        await OrderAPI.updateOrderStatus(order._id, newStatus);
        setOrder({ ...order, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái đơn hàng");
    }
  };

  if (loading) {
    return (
      <SafeAreaView className='flex-1 bg-gray-50'>
        <View className='flex-1 justify-center items-center'>
          <Text>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView className='flex-1 bg-gray-50'>
        <View className='flex-1 justify-center items-center'>
          <Text>Không tìm thấy đơn hàng</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView className='flex-1 bg-gray-50 justify-center items-center'>
        <Text className='text-xl text-gray-500'>Không tìm thấy đơn hàng</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className='mt-4 bg-primary px-6 py-3 rounded-xl'
        >
          <Text className='text-white font-medium'>Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleStatusUpdate = (newStatus: OrderStatus) => {
    Alert.alert(
      "Cập nhật trạng thái",
      `Bạn có chắc muốn cập nhật trạng thái đơn hàng thành "${getStatusText(newStatus)}"?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xác nhận",
          style: "default",
          onPress: () => updateOrderStatus(newStatus),
        },
      ]
    );
  };

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <View className='bg-white px-5 py-4 border-b border-gray-100'>
        <View className='flex-row items-center justify-between'>
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={icons.arrowback}
              className='size-5 mr-4'
              resizeMode='contain'
            />
          </TouchableOpacity>
          <View className='flex-1'>
            <Text className='text-xl font-bold text-gray-800'>
              Đơn hàng #{order.orderCode}
            </Text>
            <Text className='text-sm text-gray-500'>
              {formatDate(order.createdAt)}
            </Text>
          </View>
          <View
            className={`px-3 py-2 rounded-xl ${
              order.status === "completed"
                ? "bg-green-600"
                : order.status === "preparing"
                  ? "bg-blue-100"
                    : "bg-gray-100"
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                order.status === "completed"
                  ? "text-white"
                  : order.status === "preparing"
                    ? "text-blue-800"
                      : "text-gray-800"
              }`}
            >
              {getStatusText(order.status)}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        <View className='bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm'>
          <View className='items-center mb-6'>
            <Text className='text-2xl font-bold text-primary mb-2'>
              PECO MILK
            </Text>
            <Text className='text-sm text-gray-600'>
              📍 98/39 Đường số 17, Tân Thuận Tây, Hồ Chí Minh
            </Text>
            <Text className='text-sm text-gray-600'>📞 0563914346</Text>
          </View>
          <View className='border-t border-b border-gray-300 py-3 mb-4'>
            <Text className='text-xl font-bold text-center text-gray-800'>
              HÓA ĐƠN
            </Text>
          </View>
          <View className='mb-4'>
            <View className='flex-row justify-between mb-2'>
              <Text className='text-sm text-gray-600'>Mã đơn hàng:</Text>
              <Text className='text-sm font-semibold text-gray-800'>
                #{order.orderCode}
              </Text>
            </View>
            <View className='flex-row justify-between mb-2'>
              <Text className='text-sm text-gray-600'>Thời gian:</Text>
              <Text className='text-sm font-semibold text-gray-800'>
                {formatDate(order.createdAt)}
              </Text>
            </View>
            <View className='flex-row justify-between mb-2'>
              <Text className='text-sm text-gray-600'>Thanh toán:</Text>
              <Text className='text-sm font-semibold text-gray-800'>
                {getPaymentMethodText(order.paymentMethod)}
              </Text>
            </View>
            <View className='flex-row justify-between'>
              <Text className='text-sm text-gray-600'>Trạng thái:</Text>
              <Text className='text-sm font-semibold text-primary'>
                {getStatusText(order.status)}
              </Text>
            </View>
          </View>

          <View className='border-t border-b border-gray-300 py-3 mb-4'>
            <View className='flex-row justify-between mb-3'>
              <Text className='text-sm font-bold text-gray-700'>SẢN PHẨM</Text>
              <Text className='text-sm font-bold text-gray-700'>
                THÀNH TIỀN
              </Text>
            </View>

            {order.items && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <OrderItemDetail key={index} item={item} index={index} />
              ))
            ) : (
              <Text className='text-gray-500 text-center py-4'>
                Không có sản phẩm trong đơn hàng
              </Text>
            )}
          </View>
          <View className='mb-6'>
            <View className='flex-row justify-between items-center py-2'>
              <Text className='text-lg font-bold text-gray-800'>
                TỔNG CỘNG:
              </Text>
              <Text className='text-xl font-bold text-primary'>
                {order.total.toLocaleString("vi-VN")}đ
              </Text>
            </View>
          </View>

          <View className='border-t border-gray-300 pt-4 items-center'>
            <Text className='text-base font-semibold text-primary mb-2'>
              Cảm ơn bạn đã ghé PECO MILK 💚
            </Text>
            <Text className='text-sm text-gray-600 text-center mb-1'>
              Chúc bạn một ngày thật ngọt ngào và tươi mát ☀️
            </Text>
            <Text className='text-xs text-gray-500 text-center'>
              Hóa đơn được tạo tự động từ hệ thống PECO POS
            </Text>
          </View>
        </View>
        {nextStatusOptions(order).length > 0 && (
          <View className='mx-4 mt-4 mb-8'>
            {nextStatusOptions(order).map((option) => (
              <TouchableOpacity
                key={option.status}
                onPress={() => handleStatusUpdate(option.status as OrderStatus)}
                className={`${option.color} rounded-2xl py-4 mb-3`}
              >
                <Text className='text-white text-center font-bold text-lg'>
                  {option.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderDetailPage;
