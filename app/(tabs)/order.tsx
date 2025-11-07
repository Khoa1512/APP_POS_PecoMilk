import MonthlyOrderList from "@/components/MonthlyOrderList";
import OrderAPI, { ApiOrder } from "@/services/orderAPI";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { Alert, FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type OrderStatus = "preparing" | "completed" | "cancelled";

const OrderPage = () => {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">(
    "all"
  );

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await OrderAPI.getOrders({
        page: 1,
        limit: 50,
      });
      setOrders(response.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  }, []);
  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [fetchOrders])
  );

  // Update order status
  const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
    try {
      await OrderAPI.updateOrderStatus(orderId, status);

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // Handle payment confirmation
  const handlePaymentConfirm = async (orderId: string) => {
    try {
      const order = orders.find((o) => o._id === orderId);
      if (!order) return;

      Alert.alert(
        "Xác nhận thanh toán",
        `Xác nhận đã nhận được ${order.total.toLocaleString("vi-VN")}đ từ khách hàng?`,
        [
          { text: "Hủy", style: "cancel" },
          {
            text: "Xác nhận",
            onPress: async () => {
              try {
                // Thêm payment record
                await OrderAPI.addPayment(orderId, {
                  method: order.paymentMethod,
                  amount: order.total,
                });
                setOrders((prevOrders) =>
                  prevOrders.map((o) =>
                    o._id === orderId
                      ? { ...o, isPaid: true, paidAt: new Date().toISOString() }
                      : o
                  )
                );

                Alert.alert("Thành công", "Đã xác nhận thanh toán!");
              } catch (error) {
                console.error("Error confirming payment:", error);
                Alert.alert("Lỗi", "Không thể xác nhận thanh toán");
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error confirming payment:", error);
    }
  };

  // Filter orders by status
  const filteredOrders =
    selectedStatus === "all"
      ? orders
      : orders.filter((order) => order.status === selectedStatus);

  const statusTabs = [
    { id: "all" as const, name: "Tất cả", count: orders.length },
    {
      id: "preparing" as const,
      name: "Đang pha chế",
      count: orders.filter((o) => o.status === "preparing").length,
    },
    {
      id: "completed" as const,
      name: "Hoàn thành",
      count: orders.filter((o) => o.status === "completed").length,
    },
  ];

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      {/* Header */}
      <View className='bg-white px-5 py-4 border-b border-gray-100'>
        <Text className='text-2xl font-bold text-gray-800'>Đơn hàng</Text>
        <Text className='text-sm text-gray-500 mt-1'>
          Quản lý đơn hàng của cửa hàng
        </Text>
      </View>

      {/* Status Tabs */}
      <View className='bg-white border-b border-gray-100'>
        <FlatList
          data={statusTabs}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setSelectedStatus(item.id)}
              className={`px-4 py-3 mx-2 rounded-full border-2 ${
                selectedStatus === item.id
                  ? "bg-primary border-primary"
                  : "bg-white border-gray-200"
              }`}
            >
              <View className='flex-row items-center'>
                <Text
                  className={`text-sm font-medium ${
                    selectedStatus === item.id ? "text-white" : "text-gray-600"
                  }`}
                >
                  {item.name}
                </Text>
                {item.count > 0 && (
                  <View
                    className={`ml-2 px-2 py-0.5 rounded-full ${
                      selectedStatus === item.id ? "bg-white/20" : "bg-gray-100"
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        selectedStatus === item.id
                          ? "text-white"
                          : "text-gray-600"
                      }`}
                    >
                      {item.count}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          )}
          contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 12 }}
        />
      </View>

      {/* Orders List with monthly headers */}
      <View className='flex-1'>
        {filteredOrders.length > 0 ? (
          <MonthlyOrderList
            orders={filteredOrders}
            onStatusUpdate={handleStatusUpdate}
            onPaymentConfirm={handlePaymentConfirm}
          />
        ) : (
          <View className='flex-1 justify-center items-center px-8'>
            <Text className='text-6xl mb-4'>📋</Text>
            <Text className='text-xl font-bold text-gray-400 mb-2'>
              Chưa có đơn hàng
            </Text>
            <Text className='text-gray-500 text-center'>
              {selectedStatus === "all"
                ? "Chưa có đơn hàng nào được tạo"
                : `Chưa có đơn hàng nào ở trạng thái "${statusTabs.find((s) => s.id === selectedStatus)?.name}"`}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default OrderPage;
