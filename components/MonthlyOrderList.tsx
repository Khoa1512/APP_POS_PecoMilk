import { ApiOrder } from "@/services/orderAPI";
import React, { useRef, useState } from "react";
import { Animated, Text, View } from "react-native";
import OrderCard from "./OrderCard";

type OrderStatus = "preparing" | "completed" | "cancelled";

interface MonthlyOrderListProps {
  orders: ApiOrder[];
  onStatusUpdate: (orderId: string, status: OrderStatus) => void;
  onPaymentConfirm: (orderId: string) => void;
}

interface OrderSection {
  title: string;
  data: ApiOrder[][];
}

const MonthlyOrderList: React.FC<MonthlyOrderListProps> = ({
  orders,
  onStatusUpdate,
  onPaymentConfirm,
}) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);

  const groupOrdersByMonth = (): OrderSection[] => {
    const groupedByMonth: { [key: string]: { [key: string]: ApiOrder[] } } = {};

    orders.forEach((order) => {
      const createdAt =
        typeof order.createdAt === "string"
          ? new Date(order.createdAt)
          : order.createdAt;

      const year = createdAt.getFullYear();
      const month = createdAt.getMonth() + 1;
      const day = createdAt.getDate();

      const monthKey = `${month}/${year}`;
      const dayKey = `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}`;

      if (!groupedByMonth[monthKey]) {
        groupedByMonth[monthKey] = {};
      }

      if (!groupedByMonth[monthKey][dayKey]) {
        groupedByMonth[monthKey][dayKey] = [];
      }

      groupedByMonth[monthKey][dayKey].push(order);
    });

    return Object.entries(groupedByMonth)
      .sort(([monthA], [monthB]) => {
        const [mA, yA] = monthA.split("/").map(Number);
        const [mB, yB] = monthB.split("/").map(Number);

        if (yA !== yB) return yB - yA; // Sắp xếp theo năm giảm dần
        return mB - mA; // Sắp xếp theo tháng giảm dần
      })
      .map(([month, daysObj]) => {
        // Sắp xếp các ngày trong tháng
        const dayGroups = Object.entries(daysObj)
          .sort(([dayA], [dayB]) => {
            const [dA, mA] = dayA.split("/").map(Number);
            const [dB, mB] = dayB.split("/").map(Number);

            if (mA !== mB) return mB - mA;
            return dB - dA;
          })
          .map(([, orders]) => orders);

        return {
          title: `Tháng ${month}`,
          data: dayGroups,
        };
      });
  };

  const ordersGrouped = groupOrdersByMonth();

  // Render một nhóm đơn hàng theo ngày
  const renderDayGroup = (orders: ApiOrder[]) => {
    return (
      <View className='mb-0'>
        {orders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            onStatusUpdate={onStatusUpdate}
            onPaymentConfirm={onPaymentConfirm}
          />
        ))}
      </View>
    );
  };

  if (orders.length === 0) {
    return (
      <View className='flex-1 justify-center items-center px-8'>
        <Text className='text-6xl mb-4'>📋</Text>
        <Text className='text-xl font-bold text-gray-400 mb-2'>
          Chưa có đơn hàng
        </Text>
        <Text className='text-gray-500 text-center'>
          Chưa có đơn hàng nào được tạo
        </Text>
      </View>
    );
  }

  return (
    <View className='flex-1'>
      {ordersGrouped.length > 0 && (
        <View className='bg-gray-50 py-3.5 px-4 border-b border-t border-gray-200 z-50'>
          <View className='flex-row justify-between items-center'>
            <Text className='text-lg font-bold text-gray-700'>
              {ordersGrouped[currentMonthIndex].title}
            </Text>
            <Text className='text-sm text-blue-500'>Xem thống kê</Text>
          </View>
        </View>
      )}

      <Animated.FlatList
        data={ordersGrouped}
        keyExtractor={(item, index) => `month-${index}`}
        renderItem={({ item: section, index }) => (
          <View>
            <View style={{ height: 0, overflow: "hidden" }} />

            {section.data.map((dayGroup, dayIndex) => (
              <View key={`day-${index}-${dayIndex}`} className='mt-2'>
                {renderDayGroup(dayGroup)}
              </View>
            ))}
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        onScroll={(event) => {
          const offsetY = event.nativeEvent.contentOffset.y;

          let totalHeight = 0;
          let newMonthIndex = 0;

          for (let i = 0; i < ordersGrouped.length; i++) {
            const sectionHeight = ordersGrouped[i].data.reduce(
              (sum, dayGroup) => sum + dayGroup.length * 120,
              0
            );

            if (
              offsetY >= totalHeight &&
              offsetY < totalHeight + sectionHeight
            ) {
              newMonthIndex = i;
              break;
            }

            totalHeight += sectionHeight;

            if (i === ordersGrouped.length - 1 && offsetY >= totalHeight) {
              newMonthIndex = ordersGrouped.length - 1;
            }
          }
          if (newMonthIndex !== currentMonthIndex) {
            setCurrentMonthIndex(newMonthIndex);
          }

          scrollY.setValue(offsetY);
        }}
        scrollEventThrottle={16}
      />
    </View>
  );
};

export default MonthlyOrderList;
