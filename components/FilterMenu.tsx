import { Category } from "@/types";
import { ApiProduct } from "@/types/api";
import React, { useState } from "react";
import { FlatList, Platform, Pressable, Text, View } from "react-native";

interface FilterMenuProps {
  products: ApiProduct[];
  onFilterChange: (category: string | null) => void;
}

const FilterMenu: React.FC<FilterMenuProps> = ({
  products,
  onFilterChange,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const getCategories = (): Category[] => {
    if (!products || products.length === 0) return [];

    const uniqueCategories = [
      ...new Set(products.map((product) => product.category)),
    ];

    const categoryOrder = ["matcha", "cacao", "coffee", "other"];

    const sortedCategories = uniqueCategories.sort((a, b) => {
      const indexA = categoryOrder.indexOf(a.toLowerCase());
      const indexB = categoryOrder.indexOf(b.toLowerCase());

      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      return indexA - indexB;
    });

    return sortedCategories.map((category) => ({
      id: category.toLowerCase(),
      name: category,
    }));
  };

  const handlePress = (categoryId: string) => {
    setActiveCategory(categoryId);

    if (categoryId === "all") {
      onFilterChange(null);
    } else {
      onFilterChange(categoryId); 
    }
  };

  const categories = getCategories();
  const filterData: Category[] = [{ id: "all", name: "Tất cả" }, ...categories];

  return (
    <View className='mt-4'>
      <FlatList
        data={filterData}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            key={item.id}
            className={`
              px-3 py-2 rounded-full mr-3 border-2 ${
                activeCategory === item.id
                  ? "bg-primary border-primary"
                  : "bg-white border-gray-200"
              }
            `}
            style={
              Platform.OS === "android"
                ? { elevation: 2, shadowColor: "#878787" }
                : {
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                  }
            }
            onPress={() => handlePress(item.id)}
          >
            <Text
              className={`
                text-sm font-medium
                ${activeCategory === item.id ? "text-white" : "text-gray-700"}
              `}
            >
              {item.name}
            </Text>
          </Pressable>
        )}
        contentContainerStyle={{ paddingHorizontal: 0 }}
      />
    </View>
  );
};

export default FilterMenu;
