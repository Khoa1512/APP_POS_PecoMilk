export interface ProductOption {
  name: string;
  price: number;
  coefficient: number;
  isDefault?: boolean;
  id?: string;
}

export interface ApiProduct {
  _id: string;
  category: string;
  name: string;
  description: string;
  imageUrl?: string;
  variants?: ProductOption[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ApiResponse {
  success: boolean;
  data: ApiProduct[];
}
