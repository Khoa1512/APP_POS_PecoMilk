import { TouchableOpacity, Image } from "react-native";
import React from 'react'
import icons from '@/constants/icons';

const CartButton = () => {
  return (
    <TouchableOpacity className='flex size-10 bg-primary justify-center items-center rounded-full'>
      <Image source={icons.bag} className='size-5' resizeMode='contain'/>
    </TouchableOpacity>
  )
}

export default CartButton
