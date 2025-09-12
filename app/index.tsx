import images from "@/constants/images";
import { useRouter } from 'expo-router';

import { useEffect } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/(tabs)");
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View className='flex-1 justify-center items-center bg-primary'>
      <Image source={images.logo} className='size-60' resizeMode='contain' />
      <Text className='text-[40px] font-bold text-white font-coiny-regular mt-4 '>
        POS Peco Milk
      </Text>
      <ActivityIndicator
        className='absolute text-white bottom-10'
        size='large'
      />
    </View>
  );
}
