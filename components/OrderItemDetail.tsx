import { Text, View } from 'react-native';

  const OrderItemDetail = ({ item, index }: { item: any; index: number }) => {
    // Kiểm tra an toàn cho item
    if (!item) {
      return null;
    }

    // Tạo text tùy chọn từ options array - sử dụng optionName
    let optionsText = "";

    if (
      item.options &&
      Array.isArray(item.options) &&
      item.options.length > 0
    ) {
      // Sử dụng optionName thay vì name vì data từ API dùng optionName
      const filteredOptions = item.options.filter((opt: any) => {
        if (!opt || !opt.optionName) return false;

        const name = opt.optionName.toString().trim();
        const nameLower = name.toLowerCase();

        // Chỉ lọc bỏ "Bình thường" - giữ lại tất cả options khác
        return nameLower !== "bình thường" && nameLower !== "binh thuong";
      });

      // Tạo text từ các options còn lại
      if (filteredOptions.length > 0) {
        optionsText = filteredOptions
          .map((opt: any) => opt.optionName)
          .join(" • ");
      }
    }
    return (
      <View key={index} className='py-3 border-b border-gray-100'>
        <View className='flex-row justify-between items-start'>
          <View className='flex-1 mr-3'>
            <Text className='text-base font-semibold text-gray-800'>
              {item.productName || "Sản phẩm không xác định"}
              {item.variantName ? ` (${item.variantName})` : ""}
            </Text>
            {optionsText && optionsText.length > 0 && (
              <Text className='text-sm text-gray-600 mt-1'>{optionsText}</Text>
            )}
          </View>

          <View className='items-end'>
            <Text className='text-sm text-gray-600'>
              {item.quantity || 0} x{" "}
              {(item.basePrice || 0).toLocaleString("vi-VN")}đ
            </Text>
            <Text className='text-base font-bold text-gray-800 mt-1'>
              {(item.lineTotal || 0).toLocaleString("vi-VN")}đ
            </Text>
          </View>
        </View>
      </View>
    );
  };


export default OrderItemDetail;
