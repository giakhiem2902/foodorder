import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ChevronLeft } from 'lucide-react';
import { removeFromCart, updateQuantity } from '../../redux/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  // Lấy dữ liệu giỏ hàng từ Redux
  const { items } = useSelector((state) => state.cart);

  // Tính tổng tiền đơn hàng
  const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-6 bg-gray-100 rounded-full">
            <Trash2 size={48} className="text-gray-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Giỏ hàng của bạn đang trống</h2>
        <p className="text-gray-500 mt-2 mb-8">Hãy chọn những món ăn ngon nhất từ thực đơn của chúng tôi.</p>
        <Link to="/" className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition">
          Quay lại thực đơn
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center mb-8">
        <Link to="/" className="text-gray-500 hover:text-primary flex items-center">
          <ChevronLeft size={20} />
          <span>Tiếp tục chọn món</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Danh sách món ăn */}
        <div className="lg:col-span-2 space-y-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Giỏ hàng ({items.length})</h1>
          {items.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <img 
                src={`http://localhost:8080${item.imageUrl}`} 
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg mb-4 sm:mb-0"
              />
              <div className="sm:ml-6 flex-grow text-center sm:text-left">
                <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                <p className="text-primary font-bold">{item.price.toLocaleString()}đ</p>
              </div>

              {/* Bộ điều khiển số lượng */}
              <div className="flex items-center space-x-3 my-4 sm:my-0 sm:mx-8 bg-gray-50 rounded-full px-3 py-1">
                <button 
                  onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                  className="p-1 hover:text-primary transition"
                >
                  <Minus size={18} />
                </button>
                <span className="font-bold w-6 text-center">{item.quantity}</span>
                <button 
                  onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                  className="p-1 hover:text-primary transition"
                >
                  <Plus size={18} />
                </button>
              </div>

              <div className="flex flex-col items-end">
                <p className="font-bold text-gray-800 mb-2">{(item.price * item.quantity).toLocaleString()}đ</p>
                <button 
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Tóm tắt đơn hàng */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Tóm tắt đơn hàng</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span>{totalAmount.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển (Vũng Tàu)</span>
                <span className="text-green-600 font-medium">Miễn phí</span>
              </div>
              <div className="border-t pt-4 flex justify-between items-center">
                <span className="text-lg font-bold">Tổng cộng</span>
                <span className="text-2xl font-bold text-primary">{totalAmount.toLocaleString()}đ</span>
              </div>
            </div>
            
            <Link 
              to="/checkout" 
              className="block w-full bg-primary text-white text-center py-4 rounded-xl font-bold mt-8 hover:bg-orange-600 transition shadow-lg shadow-orange-200"
            >
              TIẾN HÀNH THANH TOÁN
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;