import { PaymentMethod } from "@/components/PaymentMethodModal";
import { ApiProduct } from "@/types/api";

export interface OrderItem {
  id: string;
  product: ApiProduct;
  selectedVariant?: string;
  selectedOptions: { [groupId: string]: string | string[] };
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: "preparing" | "completed" | "cancelled";
  createdAt: Date;
  customerInfo?: {
    name?: string;
    phone?: string;
    table?: string;
  };
}
