import { API_CONFIG } from "@/config/api";
import { useCallback, useState } from "react";

export interface ProductVariant {
  _id: string;
  name: string;
  price: number;
  costPrice: number;
  isDefault: boolean;
}

export interface ProductOption {
  _id: string;
  name: string;
  priceDelta: number; 
  isDefault: boolean;
  sortOrder: number;
}

export interface OptionsGroup {
  _id: string;
  name: string;
  uiType: string;
  required: boolean;
  options: ProductOption[];
}

export interface ProductOptionsResponse {
  success: boolean;
  data: {
    variants: ProductVariant[];
    optionGroups: OptionsGroup[];
  };
}

export const useProductOptions = (productId: string) => {
  const [options, setOptions] = useState<OptionsGroup[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(false); // Thay đổi từ true thành false
  const [error, setError] = useState<string | null>(null);

  const fetchOptions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const url = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.products}/${productId}/with-options`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ProductOptionsResponse = await response.json();

      if (data.success) {
        setOptions(data.data.optionGroups || []);
        setVariants(data.data.variants || []);
      } else {
        throw new Error("API returned unsuccessful response");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [productId]); // Dependency array với productId

  // Bỏ useEffect để không tự động fetch
  // useEffect(() => {
  //   fetchOptions();
  // }, [productId]);

  return { options, variants, loading, error, fetchOptions };
};
