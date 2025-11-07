import icons from "@/constants/icons";
import React, { useState } from "react";
import { Image, TextInput, TouchableOpacity, View } from "react-native";

interface SearchBarProps {
  onSearchChange: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearchChange,
  placeholder = "Tìm kiếm matcha, cacao ...",
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    onSearchChange(text);
  };

  const handleSearchPress = () => {
    onSearchChange(searchQuery);
  };

  return (
    <View className='flex flex-row relative items-center justify-center w-full bg-white shadow-md shadow-black/10 rounded-full text-[#181C2E] gap-5'>
      <TextInput
        className='flex-1 p-5'
        placeholder={placeholder}
        placeholderTextColor='#A0A0A0'
        returnKeyType='search'
        value={searchQuery}
        onChangeText={handleSearchChange}
        onSubmitEditing={handleSearchPress}
      />
      <TouchableOpacity className='pr-5' onPress={handleSearchPress}>
        <Image
          source={icons.search}
          className='size-6'
          resizeMode='contain'
          tintColor='#5D5F6D'
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;
