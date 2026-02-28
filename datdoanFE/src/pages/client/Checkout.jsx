import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../../redux/cartSlice";

const Checkout = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    note: "",
  });

  const totalAmount = cartItems.reduce(
    (total, item) =>
      total + Number(item.price) * Number(item.quantity),
    0
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Giỏ hàng trống!");
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.address) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const orderData = {
      customer: formData,
      items: cartItems,
      total: totalAmount,
    };

    console.log("Order gửi đi:", orderData);

    alert("Đặt hàng thành công!");
    dispatch(clearCart());
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">Xác nhận đặt hàng</h2>

      {/* Danh sách sản phẩm */}
      <div className="bg-white border rounded-lg p-4 mb-6">
        <h3 className="font-bold mb-4">Sản phẩm đã chọn</h3>

        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border-b py-2"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">
                {item.quantity} x{" "}
                {Number(item.price).toLocaleString("vi-VN")}đ
              </p>
            </div>

            <div className="font-bold">
              {(item.price * item.quantity).toLocaleString("vi-VN")}đ
            </div>
          </div>
        ))}
      </div>

      {/* Form thông tin */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-sm border space-y-4"
      >
        <div>
          <label className="block text-sm text-gray-600">
            Họ và tên *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">
            Số điện thoại *
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">
            Địa chỉ giao hàng *
          </label>
          <textarea
            name="address"
            rows="3"
            value={formData.address}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">
            Ghi chú
          </label>
          <textarea
            name="note"
            rows="2"
            value={formData.note}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        {/* Tổng tiền */}
        <div className="pt-4 border-t flex justify-between font-bold text-lg">
          <span>Thành tiền:</span>
          <span className="text-green-600">
            {totalAmount.toLocaleString("vi-VN")}đ
          </span>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700"
        >
          XÁC NHẬN ĐƠN HÀNG
        </button>
      </form>
    </div>
  );
};

export default Checkout;