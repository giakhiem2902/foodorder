import axiosClient from "./axiosClient.js";

const productApi = {
  getAllClient: async () => {
    const data = await axiosClient.get('/client/products');
    console.log("API RAW DATA:", data);
    return data; // 🔥 KHÔNG .data nữa
  },
};

export default productApi;