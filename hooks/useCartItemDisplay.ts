import { useCallback, useEffect, useState } from "react";
import { useProductOptions } from "./useProductOptions";

export const useCartItemDisplay = (
  productId: string,
  selectedOptions: { [groupId: string]: string | string[] }
) => {
  const { options, fetchOptions } = useProductOptions(productId);
  const [displayOptions, setDisplayOptions] = useState<
    { groupName: string; optionNames: string[]; priceIncrease: number }[]
  >([]);

  const memoizedFetch = useCallback(() => {
    fetchOptions();
  }, [fetchOptions]);

  useEffect(() => {
    // Fetch options khi hook được gọi
    memoizedFetch();
  }, [memoizedFetch]);

  useEffect(() => {
    if (options && Object.keys(selectedOptions).length > 0) {
      const display = options
        .map((group) => {
          const selectedValue = selectedOptions[group._id];

          if (!selectedValue) {
            return null;
          }

          let optionNames: string[] = [];
          let totalPriceIncrease = 0;

          if (group.uiType === "single" && typeof selectedValue === "string") {
            const option = group.options.find(
              (opt) => opt._id === selectedValue
            );
            if (option) {
              optionNames = [option.name];
              totalPriceIncrease = option.priceDelta;
            }
          } else if (group.uiType === "multi" && Array.isArray(selectedValue)) {
            selectedValue.forEach((optionId) => {
              const option = group.options.find((opt) => opt._id === optionId);
              if (option) {
                optionNames.push(option.name);
                totalPriceIncrease += option.priceDelta;
              }
            });
          }

          return optionNames.length > 0
            ? {
                groupName: group.name,
                optionNames,
                priceIncrease: totalPriceIncrease,
              }
            : null;
        })
        .filter(Boolean) as {
        groupName: string;
        optionNames: string[];
        priceIncrease: number;
      }[];

      setDisplayOptions(display);
    }
  }, [options, selectedOptions]);

  return displayOptions;
};
