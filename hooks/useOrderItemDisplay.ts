import { useCallback, useEffect, useState } from "react";
import { useProductOptions } from "./useProductOptions";

export interface OrderItemOption {
  name: string;
  price: number;
}

export interface OrderItemDisplayGroup {
  groupName: string;
  options: OrderItemOption[];
}

export const useOrderItemDisplay = (
  productId: string,
  selectedOptions: { [groupId: string]: string | string[] }
) => {
  const { options, fetchOptions } = useProductOptions(productId);
  const [displayGroups, setDisplayGroups] = useState<OrderItemDisplayGroup[]>(
    []
  );

  const memoizedFetch = useCallback(() => {
    fetchOptions();
  }, [fetchOptions]);

  useEffect(() => {
    memoizedFetch();
  }, [memoizedFetch]);

  useEffect(() => {
    if (options && Object.keys(selectedOptions).length > 0) {
      const groups = options
        .map((group) => {
          const selectedValue = selectedOptions[group._id];

          if (!selectedValue) {
            return null;
          }

          let optionItems: OrderItemOption[] = [];

          if (group.uiType === "single" && typeof selectedValue === "string") {
            const option = group.options.find(
              (opt) => opt._id === selectedValue
            );
            if (option) {
              optionItems = [
                {
                  name: option.name,
                  price: option.priceDelta,
                },
              ];
            }
          } else if (group.uiType === "multi" && Array.isArray(selectedValue)) {
            selectedValue.forEach((optionId) => {
              const option = group.options.find((opt) => opt._id === optionId);
              if (option) {
                optionItems.push({
                  name: option.name,
                  price: option.priceDelta,
                });
              }
            });
          }

          return optionItems.length > 0
            ? {
                groupName: group.name,
                options: optionItems,
              }
            : null;
        })
        .filter(Boolean) as OrderItemDisplayGroup[];

      setDisplayGroups(groups);
    }
  }, [options, selectedOptions]);

  return displayGroups;
};
