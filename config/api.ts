export const API_CONFIG = {
  // baseURL: "https://admin-peco-milk.vercel.app",
  baseURL: "http://localhost:3000",

  endpoints: {
    products: "/api/products",
    orders: "/api/orders",
  },
  // Thêm timeout và headers mặc định
  timeout: 30000, // Tăng timeout lên 30s
  headers: {
    "Content-Type": "application/json",
  },
};
