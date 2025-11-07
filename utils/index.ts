import { ApiOrder } from '@/services/orderAPI';
import { OrderStatus } from "@/types";


export const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "preparing":
      return "bg-blue-100 text-blue-800";
    case "completed":
      return "bg-green-400 text-white";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStatusText = (status: OrderStatus) => {
  switch (status) {
    case "preparing":
      return "Đang pha chế";
    case "completed":
      return "Hoàn thành";
    case "cancelled":
      return "Đã hủy";
    default:
      return "Không xác định";
  }
};

export const getPaymentMethodText = (method: string) => {
  switch (method) {
    case "transfer":
      return "Chuyển khoản";
    case "cash":
      return "Tiền mặt";
    case "app":
      return "App";
    default:
      return "Không xác định";
  }
};

export const formatDate = (date: Date | string) => {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return "Invalid date";
    }
    return new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(dateObj);
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Invalid date";
  }
};

export const nextStatusOptions = (order: ApiOrder) => {
  if (!order) return [];
  switch (order.status) {
    case "preparing":
      return [
        { status: "completed", text: "Đã hoàn thành", color: "bg-green-500" },
      ];
    default:
      return [];
  }
};

