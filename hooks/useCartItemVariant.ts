import { useCallback, useEffect, useState } from "react";
import { useProductOptions } from "./useProductOptions";

export const useCartItemVariant = (
  productId: string,
  selectedVariantId?: string
) => {
  const { variants, fetchOptions } = useProductOptions(productId);
  const [variantInfo, setVariantInfo] = useState<{
    name: string;
    price: number;
  } | null>(null);

  const memoizedFetch = useCallback(() => {
    fetchOptions();
  }, [fetchOptions]);

  useEffect(() => {
    memoizedFetch();
  }, [memoizedFetch]);

  useEffect(() => {
    if (variants && selectedVariantId) {
      const variant = variants.find((v) => v._id === selectedVariantId);
      if (variant) {
        setVariantInfo({
          name: variant.name,
          price: variant.price,
        });
      }
    } else {
      setVariantInfo(null);
    }
  }, [variants, selectedVariantId]);

  return variantInfo;
};
