import CartButton from "@/components/CartButton";
import FilterMenu from "@/components/FilterMenu";
import MenuCart from "@/components/MenuCart";
import SearchBar from "@/components/SearchBar";
import { useProducts } from "@/hooks/useProducts";
import cn from "clsx";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomePage = () => {
  const { products, loading, error, refetch } = useProducts();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter products based on selected category and search query
  const filteredProducts = products.filter((product) => {
    // Filter by category
    const categoryMatch = selectedCategory
      ? product.category.toLowerCase() === selectedCategory
      : true;

    // Filter by search query (search in name and description)
    const searchMatch = searchQuery
      ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return categoryMatch && searchMatch;
  });

  const handleFilterChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (loading && products.length === 0) {
    return (
      <SafeAreaView className='flex-1 bg-white'>
        <View className='bg-white px-5 py-7 border-b border-gray-100'>
          <View className='flex justify-between flex-row w-full mb-5'>
            <View className='flex flex-col justify-center items-start'>
              <Text className='text-primary font-coiny-regular text-3xl'>
                Peco Milk
              </Text>
              <Text className='text-primary font-coiny-regular text-xl'>
                Menu peco
              </Text>
            </View>
            <CartButton />
          </View>
          <SearchBar onSearchChange={handleSearchChange} />
          <FilterMenu products={[]} onFilterChange={handleFilterChange} />
        </View>
        <View className='flex-1 justify-center items-center'>
          <ActivityIndicator size='large' color='#0066CC' />
          <Text className='mt-4 text-gray-600'>Đang tải menu...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className='flex-1 bg-white'>
        <View className='bg-white px-5 py-7 border-b border-gray-100'>
          <View className='flex justify-between flex-row w-full mb-5'>
            <View className='flex flex-col justify-center items-start'>
              <Text className='text-primary font-coiny-regular text-3xl'>
                Peco Milk
              </Text>
              <Text className='text-primary font-coiny-regular text-xl'>
                Menu peco
              </Text>
            </View>
            <CartButton />
          </View>
          <SearchBar onSearchChange={handleSearchChange} />
          <FilterMenu products={products} onFilterChange={handleFilterChange} />
        </View>
        <View className='flex-1 justify-center items-center'>
          <Text className='text-red-500 text-lg font-semibold mb-2'>
            Không thể tải menu
          </Text>
          <Text className='text-gray-600 text-center px-6 mb-4'>
            Vui lòng kiểm tra kết nối mạng và thử lại
          </Text>
          <TouchableOpacity
            onPress={refetch}
            className='bg-primary px-6 py-3 rounded-xl'
          >
            <Text className='text-white font-semibold'>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-white'>
      {/* Fixed Header */}
      <View className='bg-white px-5 py-7 border-b border-gray-100'>
        <View className='flex justify-between flex-row w-full mb-5'>
          <View className='flex flex-col justify-center items-start'>
            <Text className='text-primary font-coiny-regular text-3xl'>
              Peco Milk
            </Text>
            <Text className='text-primary font-coiny-regular text-xl'>
              Menu peco
            </Text>
          </View>
          <CartButton />
        </View>
        <SearchBar onSearchChange={handleSearchChange} />
        <FilterMenu products={products} onFilterChange={handleFilterChange} />
      </View>

      {/* Scrollable Content */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item._id}
        numColumns={2}
        renderItem={({ item, index }) => {
          const isFirstRightColumn = index % 2 === 0;
          return (
            <View
              className={cn(
                "flex-1 max-w-[48%]",
                !isFirstRightColumn ? "mt-10" : "mt-0"
              )}
            >
              <MenuCart item={item} />
            </View>
          );
        }}
        columnWrapperClassName='gap-7'
        contentContainerClassName='gap-5 px-5 pb-32 pt-10'
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default HomePage;
