import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/client/orders';

// Hàm helper để lấy cấu hình Header có chứa Token
const getAuthConfig = () => {
  const token = localStorage.getItem('token'); // Hoặc lấy từ Redux auth state
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

const orderApi = {
  // 1. Gửi đơn hàng (Checkout)
  checkout: (orderData) => {
    return axios.post(`${BASE_URL}/checkout`, orderData, getAuthConfig());
  },

  // 2. Lấy lịch sử đơn hàng của User
  getMyOrders: (userId) => {
    return axios.get(`${BASE_URL}/user/${userId}`, getAuthConfig());
  },

  // 3. Lấy chi tiết một đơn hàng
  getOrderDetail: (orderId) => {
    return axios.get(`${BASE_URL}/${orderId}`, getAuthConfig());
  },

  // 4. Hủy đơn hàng
  cancelOrder: (orderId, userId) => {
    return axios.post(`${BASE_URL}/${orderId}/cancel?userId=${userId}`, {}, getAuthConfig());
  }
};

export default orderApi;