import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authApi from '../../api/authApi.js';
import { User, Mail, Lock, Phone, MapPin, UserPlus } from 'lucide-react'; // Thêm icon cho hiện đại

const Register = () => {
  const [formData, setFormData] = useState({
    username: '', 
    email: '', 
    password: '', 
    fullName: '', 
    phone: '', 
    address: '',
    roles: ['user'] // Gửi mảng để khớp với Set<String> ở Backend
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Gửi formData khớp hoàn toàn với RegisterRequest
      await authApi.register(formData); 
      alert("Đăng ký thành công! Hãy đăng nhập để đặt món.");
      navigate('/login');
    } catch (err) {
      // Hiển thị lỗi từ Validation của Spring Boot
      setError(err.response?.data?.message || "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-gray-800 shadow-sm";

  return (
    <div className="w-full min-h-screen flex bg-white">
      {/* 1. Bên trái: Hình ảnh & Nội dung giới thiệu (Chỉ hiện trên Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80" 
            className="w-full h-full object-cover opacity-20 scale-110" 
            alt="Vung Tau Food" 
          />
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/90 to-primary/60"></div>
        </div>
        
        <div className="relative z-10 text-white max-w-md text-center">
          <h1 className="text-5xl font-black mb-6">Gia Nhập SmartFood</h1>
          <p className="text-xl opacity-90 font-light leading-relaxed">
            Tạo tài khoản để trải nghiệm dịch vụ đặt món nhanh nhất tại Vũng Tàu. Ưu đãi 50% cho đơn hàng đầu tiên!
          </p>
        </div>
      </div>

      {/* 2. Bên phải: Form Đăng ký */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-gray-50 lg:bg-white">
        <div className="max-w-xl w-full">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Đăng Ký Tài Khoản</h2>
            <p className="text-gray-500 font-medium">Bắt đầu hành trình ẩm thực của bạn ngay hôm nay</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6 shadow-sm">
              <span className="text-sm font-bold">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Họ tên */}
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  placeholder="Họ và tên"
                  className={inputClass}
                  required
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
              {/* Username */}
              <div className="relative">
                <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  placeholder="Tên đăng nhập"
                  className={inputClass}
                  required
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  placeholder="Email"
                  className={inputClass}
                  required
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              {/* Số điện thoại */}
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  placeholder="Số điện thoại"
                  className={inputClass}
                  required
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            {/* Mật khẩu */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                placeholder="Mật khẩu (ít nhất 6 ký tự)"
                className={inputClass}
                required
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            {/* Địa chỉ */}
            <div className="relative">
              <MapPin className="absolute left-4 top-4 text-gray-400" size={18} />
              <textarea
                placeholder="Địa chỉ giao hàng tại Vũng Tàu"
                className={`${inputClass} h-28 pl-11 pt-3.5`}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 bg-primary hover:bg-orange-600 disabled:bg-orange-300 text-white font-black rounded-2xl shadow-xl shadow-orange-200 transition-all transform active:scale-[0.98] flex items-center justify-center text-lg mt-4"
            >
              {isLoading ? "Đang xử lý..." : "Đăng Ký Ngay"}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-600 font-medium">
            Đã có tài khoản? <Link to="/login" className="text-primary font-black hover:underline">Đăng nhập tại đây</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;