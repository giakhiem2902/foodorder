import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Hook để lấy dữ liệu từ Redux
import { useAuth } from '../../context/AuthContext'; // Hook quản lý đăng nhập
import { ShoppingCart, User, LogOut } from 'lucide-react'; // Icon từ thư viện Lucide

const Header = () => {
  // Lấy danh sách món ăn từ Redux Store
  const cartItems = useSelector((state) => state.cart.items);
  const { user, logout } = useAuth();

  // Tính tổng số lượng món ăn trong giỏ
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo dự án Smart Food */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary">Smart<span className="text-gray-800">Food</span></span>
          </Link>

          <div className="flex items-center space-x-6">
            {/* Icon Giỏ hàng với Badge */}
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary transition">
              <ShoppingCart size={28} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full animate-bounce">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Quản lý tài khoản */}
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-700">
                  <User size={20} />
                  <span className="font-medium hidden sm:block">{user.fullName}</span>
                </div>
                <button 
                  onClick={logout}
                  className="p-2 text-gray-500 hover:text-red-600 transition"
                  title="Đăng xuất"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-primary text-white px-5 py-2 rounded-full font-semibold hover:bg-orange-600 transition"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;