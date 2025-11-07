
import CustomToggle from '@/components/CustomToggle';
import icons from "@/constants/icons";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SettingPage = () => {
  const SettingItem = ({
    icon,
    title,
    subtitle,
    onPress,
  }: {
    icon: any;
    title: string;
    subtitle?: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className='flex-row items-center px-5 py-4 bg-white border-b border-gray-100'
    >
      <View className='size-10 bg-gray-100 rounded-full items-center justify-center mr-4'>
        <Image
          source={icon}
          className='size-5 opacity-60'
          resizeMode='contain'
        />
      </View>
      <View className='flex-1'>
        <Text className='text-gray-800 font-medium text-base'>{title}</Text>
        {subtitle && (
          <Text className='text-gray-500 text-sm mt-0.5'>{subtitle}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <View className='px-5 py-3 bg-gray-50'>
      <Text className='text-sm font-medium text-gray-500'>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <View className='bg-white px-5 py-4 border-b border-gray-100'>
        <Text className='text-2xl font-bold text-gray-800'>Cài đặt</Text>
        <Text className='text-sm text-gray-500 mt-1'>
          Quản lý cấu hình cửa hàng
        </Text>
      </View>

      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        <SectionHeader title='THÔNG TIN CỬA HÀNG' />
        <SettingItem
          icon={icons.menu}
          title='Thông tin cơ bản'
          subtitle='Tên, địa chỉ, liên hệ'
        />
        <SettingItem
          icon={icons.menu}
          title='Giờ hoạt động'
          subtitle='Quản lý thời gian mở cửa'
        />

        <SectionHeader title='QUẢN LÝ MENU' />
        <SettingItem
          icon={icons.menu}
          title='Danh mục'
          subtitle='Quản lý danh mục sản phẩm'
        />
        <SettingItem
          icon={icons.menu}
          title='Sản phẩm'
          subtitle='Quản lý đồ uống và thực đơn'
        />
        <SettingItem
          icon={icons.menu}
          title='Khuyến mãi'
          subtitle='Quản lý giảm giá và ưu đãi'
        />

        <SectionHeader title='THANH TOÁN' />
        <SettingItem
          icon={icons.menu}
          title='Phương thức thanh toán'
          subtitle='Quản lý các hình thức thanh toán'
        />
        <SettingItem
          icon={icons.menu}
          title='Hóa đơn'
          subtitle='Mẫu hóa đơn và biên nhận'
        />

        <SectionHeader title='HỆ THỐNG' />
        <SettingItem
          icon={icons.menu}
          title='Thông báo'
          subtitle='Cài đặt thông báo đơn hàng'
        />
        <SettingItem
          icon={icons.menu}
          title='Máy in'
          subtitle='Cài đặt máy in hóa đơn'
        />
        <SettingItem
          icon={icons.menu}
          title='Thông tin ứng dụng'
          subtitle='Phiên bản và cập nhật'
        />

        <View className='h-20' />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingPage;
