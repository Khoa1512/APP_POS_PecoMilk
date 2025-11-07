import { API_CONFIG } from "@/config/api";

const API_BASE_URL = API_CONFIG.baseURL;

export interface CreateOrderPayload {
  items: {
    productId: string;
    productName: string;
    productImage?: string;
    variantId?: string;
    variantName?: string;
    basePrice: number;
    quantity: number;
    options: {
      optionGroupId: string;
      optionGroupName: string;
      optionId: string;
      optionName: string;
      priceDelta: number;
    }[];
    lineTotal: number;
  }[];
  subtotal: number;
  discount: number;
  discountPercent: number;
  total: number;
  paymentMethod: "cash" | "transfer" | "app";
  customerInfo?: {
    name?: string;
    phone?: string;
    table?: string;
  };
  channel: string;
  note?: string;
}

export interface ApiOrder {
  _id: string;
  orderCode: string;
  status: "preparing" | "completed" | "cancelled";
  channel: string;
  items: {
    productId: string;
    productName: string;
    productImage?: string;
    variantId?: string;
    variantName?: string;
    basePrice: number;
    quantity: number;
    options: {
      optionGroupId: string;
      optionGroupName: string;
      optionId: string;
      optionName: string;
      priceDelta: number;
    }[];
    lineTotal: number;
  }[];
  subtotal: number;
  discount: number;
  discountPercent: number;
  total: number;
  paymentMethod: "cash" | "transfer" | "app";
  payments: {
    method: "cash" | "transfer" | "app";
    amount: number;
    txnId?: string;
    note?: string;
    createdAt: Date | string;
  }[];
  isPaid: boolean;
  paidAt?: Date | string;
  customerInfo?: {
    name?: string;
    phone?: string;
    table?: string;
  };
  staffId?: string;
  note?: string;
  totalItems: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

class OrderAPI {
  static async createOrder(payload: CreateOrderPayload): Promise<ApiOrder> {
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Backend error response:", error);
      console.error("Response status:", response.status);
      console.error("Response statusText:", response.statusText);
      throw new Error(error.message || "Failed to create order");
    }

    const data = await response.json();
    return data.data;
  }

  static async getOrders(params?: {
    status?: "preparing" | "completed" | "cancelled";
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{
    orders: ApiOrder[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();

    if (params?.status) queryParams.append("status", params.status);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);

    const response = await fetch(
      `${API_BASE_URL}/api/orders?${queryParams.toString()}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }

    const data = await response.json();
    return data;
  }

  // Lấy chi tiết đơn hàng
  static async getOrderById(orderId: string): Promise<ApiOrder> {
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch order");
    }

    const data = await response.json();
    return data.data;
  }

  static async updateOrderStatus(
    orderId: string,
    status: "preparing" | "completed" | "cancelled"
  ): Promise<ApiOrder> {
    const response = await fetch(
      `${API_BASE_URL}/api/orders/${orderId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update order status");
    }

    const data = await response.json();
    return data.data;
  }

  // Thêm payment vào đơn hàng
  static async addPayment(
    orderId: string,
    payment: {
      method: "cash" | "transfer" | "app";
      amount: number;
      txnId?: string;
      note?: string;
    }
  ): Promise<ApiOrder> {
    const response = await fetch(
      `${API_BASE_URL}/api/orders/${orderId}/payments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payment),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to add payment");
    }

    const data = await response.json();
    return data.data;
  }

  // Lấy thống kê đơn hàng
  static async getOrderStats(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<{
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    statusBreakdown: Record<string, number>;
  }> {
    const queryParams = new URLSearchParams();

    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);

    const response = await fetch(
      `${API_BASE_URL}/api/orders/stats?${queryParams.toString()}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch order stats");
    }

    const data = await response.json();
    return data.data;
  }
}

export default OrderAPI;
