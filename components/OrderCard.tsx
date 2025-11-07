import { ApiOrder } from "@/services/orderAPI";
import { getPaymentMethodText, getStatusColor, getStatusText } from "@/utils";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import PaymentMethodModal, { PaymentMethod } from "./PaymentMethodModal";

type OrderStatus = "preparing" | "completed" | "cancelled";

interface OrderCardProps {
  order: ApiOrder;
  onStatusUpdate?: (orderId: string, status: OrderStatus) => void;
  onPaymentConfirm?: (orderId: string) => void;
}

const OrderCard = ({
  order,
  onStatusUpdate,
  onPaymentConfirm,
}: OrderCardProps) => {
  const router = useRouter();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handlePaymentConfirm = (method: PaymentMethod) => {
    onPaymentConfirm?.(order._id);
    setShowPaymentModal(false);
  };

  const handleCardPress = () => {
    router.push(`/(screens)/order-detail?orderId=${order._id}`);
  };

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) {
        return "Invalid date";
      }
      return new Intl.DateTimeFormat("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(dateObj);
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  const nextStatusOptions = () => {
    switch (order.status) {
      case "preparing":
        return ["completed"];
      default:
        return [];
    }
  };

  const getNextStatusText = (status: string) => {
    switch (status) {
      case "preparing":
        return "Chuẩn bị";
      case "completed":
        return "Hoàn thành";
      default:
        return "Cập nhật";
    }
  };

  return (
    <View className='mx-4 mb-4'>
      <TouchableOpacity
        onPress={handleCardPress}
        activeOpacity={0.7}
        className='bg-white rounded-2xl p-4 shadow-sm border border-gray-100'
      >
        {/* Header */}
        <View className='flex-row justify-between items-start mb-3'>
          <View className='flex-1'>
            <Text className='text-lg font-bold text-gray-800 mb-1'>
              Đơn hàng #{order.orderCode}
            </Text>
            <Text className='text-sm text-gray-500'>
              {formatDate(order.createdAt)}
            </Text>
          </View>
          <View
            className={`px-3 py-1 rounded-full ${getStatusColor(order.status)}`}
          >
            <Text
              className={`text-xs font-medium ${
                getStatusColor(order.status).includes("blue")
                  ? "text-blue-800"
                  : getStatusColor(order.status).includes("green")
                    ? "text-green-800"
                    : "text-red-800"
              }`}
            >
              {getStatusText(order.status)}
            </Text>
          </View>
        </View>

        {/* Items */}
        <View className='mb-3'>
          <Text className='text-sm font-medium text-gray-700 mb-2'>
            Sản phẩm ({order.items.length} món)
          </Text>
          {order.items.map((item, index) => {
            // Tạo text options
            let optionsText = "";
            if (
              item.options &&
              Array.isArray(item.options) &&
              item.options.length > 0
            ) {
              const filteredOptions = item.options.filter((opt: any) => {
                if (!opt || !opt.optionName) return false;
                const name = opt.optionName.toString().trim();
                const nameLower = name.toLowerCase();
                return (
                  nameLower !== "bình thường" && nameLower !== "binh thuong"
                );
              });

              if (filteredOptions.length > 0) {
                optionsText = filteredOptions
                  .map((opt: any) => opt.optionName)
                  .join(" • ");
              }
            }

            return (
              <View key={index} className='flex-row items-center mb-2'>
                {item.productImage && (
                  <Image
                    source={{ uri: item.productImage }}
                    className='size-12 rounded-lg mr-3'
                    resizeMode='contain'
                  />
                )}
                <View className='flex-1'>
                  <Text className='text-sm font-medium text-gray-800'>
                    {item.productName}
                  </Text>
                  {optionsText && (
                    <Text className='text-xs text-blue-600 mt-1'>
                      {optionsText}
                    </Text>
                  )}
                  <Text className='text-xs text-gray-500 mt-1'>
                    Số lượng: {item.quantity}
                  </Text>
                </View>
                <Text className='text-sm font-medium text-gray-800'>
                  {item.lineTotal.toLocaleString("vi-VN")}đ
                </Text>
              </View>
            );
          })}
        </View>

        {/* Payment & Total */}
        <View className='border-t border-gray-100 pt-3'>
          <View className='flex-row justify-between items-center mb-3'>
            <View className='flex-row items-center'>
              <Text className='text-sm text-gray-600'>
                {getPaymentMethodText(order.paymentMethod)}
              </Text>
            </View>
            <Text className='text-lg font-bold text-primary'>
              {order.total.toLocaleString("vi-VN")}đ
            </Text>
          </View>

          {/* Payment Status Display */}
          {order.isPaid && (
            <View className='bg-green-100 rounded-xl py-2 px-3 border border-green-200 mb-3'>
              <Text className='text-green-800 text-center font-medium text-sm'>
                ✓ Đã thanh toán
              </Text>
            </View>
          )}

          {/* Action Buttons */}
          <View className='flex-row gap-2'>
            {/* Payment Confirmation Button */}
            {!order.isPaid && onPaymentConfirm && (
              <TouchableOpacity
                onPress={() => setShowPaymentModal(true)}
                className='flex-1 bg-green-500 py-3 px-4 rounded-xl'
              >
                <Text className='text-white font-medium text-center text-sm'>
                  Xác nhận thanh toán
                </Text>
              </TouchableOpacity>
            )}

            {/* Payment Method Modal */}
            {!order.isPaid && (
              <PaymentMethodModal
                visible={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onSelectPayment={handlePaymentConfirm}
              />
            )}

            {/* Status Update Button */}
            {onStatusUpdate && nextStatusOptions().length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  const nextStatus = nextStatusOptions()[0];
                  onStatusUpdate(order._id, nextStatus as OrderStatus);
                }}
                className='flex-1 bg-primary py-3 px-4 rounded-xl'
              >
                <Text className='text-white font-medium text-center text-sm'>
                  {getNextStatusText(nextStatusOptions()[0])}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default OrderCard;
