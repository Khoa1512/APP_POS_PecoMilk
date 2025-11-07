import React from "react";
import { View, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

interface ToggleProps {
  isOn: boolean;
  style?: string;
  onToggle?: (value: boolean) => void;
  disabled?: boolean;
}

const CustomToggle = ({
  isOn,
  onToggle,
  disabled = false,
  style,
}: ToggleProps) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(isOn ? 23 : 3, { duration: 200 }) }],
  }));

  return (
    <Pressable onPress={() => onToggle?.(!isOn)} className={`${style}`}>
      <View
        className={`w-[50px] h-8 rounded-full justify-center  ${
          isOn ? "bg-primary" : "bg-gray-200"
        } ${disabled ? "opacity-50" : ""}
        }`}
      >
        <Animated.View
          style={animatedStyle}
          className='w-7 h-7 rounded-full px-0.5 bg-white'
        />
      </View>
    </Pressable>
  );
};

export default CustomToggle;
