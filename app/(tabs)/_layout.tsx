import { Tabs } from "expo-router";
import React from "react";
import cn from "clsx";

import { Image, ImageSourcePropType, Text, View } from "react-native";
import icons from '@/constants/icons';

interface TabBarIconProps {
  focused: boolean;
  icon: ImageSourcePropType;
  title: string;
}
const TabIcon = ({ focused, icon, title }: TabBarIconProps) => (
  <View className='flex min-w-20 rounded-xl justify-center min-h-full gap-1 mt-12 items-center'>
    <Image
      source={icon}
      className='size-7'
      resizeMode='contain'
      tintColor={focused ? "#315c41" : "#5D5F6D"}
    />
    <Text
      className={cn(
        "text-sm font-bold",
        focused ? "text-primary" : "text-gray-500"
      )}
    >
      {title}
    </Text>
  </View>
);

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
          marginHorizontal: 20,
          height: 80,
          position: "absolute",
          backgroundColor: "white",
          shadowColor: "#1a1a1a",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ focused }: any) => (
            <TabIcon focused={focused} icon={icons.menu} title='Menu' />
          ),
        }}
      />
      <Tabs.Screen
        name='cart'
        options={{
          headerShown: false,
          title: "Cart",
          tabBarIcon: ({ focused }: any) => (
            <TabIcon focused={focused} icon={icons.cart} title='Giỏ hàng' />
          ),
        }}
      />
      <Tabs.Screen
        name='order'
        options={{
          headerShown: false,
          title: "Order",
          tabBarIcon: ({ focused }: any) => (
            <TabIcon focused={focused} icon={icons.order} title='Đơn hàng' />
          ),
        }}
      />
      <Tabs.Screen
        name='setting'
        options={{
          headerShown: false,
          title: "Setting",
          tabBarIcon: ({ focused }: any) => (
            <TabIcon focused={focused} icon={icons.setting} title='Cài đặt' />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
