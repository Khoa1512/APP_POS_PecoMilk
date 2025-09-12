import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import CartButton from '@/components/CartButton';


const HomePage = () => {
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className='flex justify-between flex-row px-5 w-full my-5 '>
        <View className='flex flex-col justify-center items-start'>
          <Text className='text-primary font-coiny-regular text-3xl'>
            Peco Milk
          </Text>
          <Text className='text-primary font-coiny-regular text-xl'>
            Menu peco
          </Text>
        </View>
        <CartButton/>
      </View>
    </SafeAreaView>
  );
}

export default HomePage
