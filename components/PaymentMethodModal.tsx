import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

export type PaymentMethod = "transfer" | "cash" | "app";

interface PaymentMethodModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectPayment: (method: PaymentMethod) => void;
}

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
  visible,
  onClose,
  onSelectPayment,
}) => {
  const paymentMethods = [
    {
      id: "transfer" as PaymentMethod,
      name: "Chuyển khoản",
      icon: "🏦",
      description: "Thanh toán qua ngân hàng",
    },
    {
      id: "cash" as PaymentMethod,
      name: "Tiền mặt",
      icon: "💵",
      description: "Thanh toán bằng tiền mặt",
    },
    {
      id: "app" as PaymentMethod,
      name: "App",
      icon: "📱",
      description: "Thanh toán qua ứng dụng",
    },
  ];

  const handleSelectPayment = (method: PaymentMethod) => {
    onSelectPayment(method);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType='slide'
      onRequestClose={onClose}
    >
      <View className='flex-1 bg-black/50 justify-end'>
        <View className='bg-white rounded-t-3xl p-6'>
          {/* Header */}
          <View className='flex-row items-center justify-between mb-6'>
            <Text className='text-xl font-bold text-gray-800'>
              Chọn phương thức thanh toán
            </Text>
            <TouchableOpacity onPress={onClose} className='p-2'>
              <Text className='text-2xl text-gray-400 font-bold'>×</Text>
            </TouchableOpacity>
          </View>

          {/* Payment Methods */}
          <View className='space-y-3'>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                onPress={() => handleSelectPayment(method.id)}
                className='bg-gray-50 border border-gray-200 rounded-2xl p-4 flex-row items-center'
                activeOpacity={0.7}
              >
                <Text className='text-3xl mr-4'>{method.icon}</Text>
                <View className='flex-1'>
                  <Text className='text-lg font-semibold text-gray-800'>
                    {method.name}
                  </Text>
                  <Text className='text-sm text-gray-500'>
                    {method.description}
                  </Text>
                </View>
                <Text className='text-gray-400 text-lg'>›</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            onPress={onClose}
            className='mt-6 bg-gray-100 rounded-2xl py-4'
          >
            <Text className='text-center text-gray-600 font-medium text-lg'>
              Hủy
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PaymentMethodModal;
