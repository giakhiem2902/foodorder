import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { User, Lock, ArrowRight, LogIn } from 'lucide-react'; // Thêm icons cho hiện đại

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái loading
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // credentials gửi đi khớp với LoginRequest {username, password}
      const result = await login(credentials);
      if (result.success) {
        navigate('/'); 
      } else {
        setError(result.message || 'Tên đăng nhập hoặc mật khẩu không đúng');
      }
    } catch (err) {
      setError('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex bg-white">
      {/* 1. Bên trái: Hình ảnh thương hiệu (Ẩn trên mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80" 
            className="w-full h-full object-cover opacity-30 scale-110" 
            alt="Vung Tau Food" 
          />
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/80 to-primary/40"></div>
        </div>
        
        <div className="relative z-10 text-white max-w-lg">
          <h1 className="text-6xl font-black mb-6 leading-tight">Chào mừng bạn trở lại!</h1>
          <p className="text-xl opacity-90 font-light leading-relaxed">
            Đăng nhập để tiếp tục khám phá những món ngon đặc sản Vũng Tàu và nhận ưu đãi độc quyền hôm nay.
          </p>
        </div>
      </div>

      {/* 2. Bên phải: Form đăng nhập */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-gray-50 lg:bg-white">
        <div className="max-w-md w-full">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-black text-gray-900 mb-3">Đăng Nhập</h2>
            <p className="text-gray-500 font-medium">Vui lòng nhập thông tin tài khoản Vũng Tàu Food</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6 flex items-center shadow-sm">
              <span className="text-sm font-bold">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Trường Username */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Tên đăng nhập</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Nhập username của bạn"
                  className="block w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-gray-800 shadow-sm"
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                />
              </div>
            </div>

            {/* Trường Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-gray-700">Mật khẩu</label>
                <Link to="/forgot-password" size="sm" className="text-xs text-primary font-bold hover:underline">Quên mật khẩu?</Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-gray-800 shadow-sm"
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 bg-primary hover:bg-orange-600 disabled:bg-orange-300 text-white font-black rounded-2xl shadow-xl shadow-orange-200 transition-all transform active:scale-[0.98] flex items-center justify-center text-lg gap-2"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <> Đăng nhập ngay <LogIn size={22} /> </>
              )}
            </button>
          </form>

          <div className="mt-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-400 font-medium">Hoặc đăng nhập bằng</span></div>
            </div>

            <div className="mt-6 flex gap-4">
              <button className="w-full py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center font-bold text-gray-700 gap-2">
                <img src="https://www.svgrepo.com/show/475656/google_color.svg" className="h-5 w-5" alt="Google" /> Google
              </button>
            </div>

            <p className="mt-8 text-center text-gray-600 font-medium">
              Bạn là người mới? <Link to="/register" className="text-primary font-black hover:underline inline-flex items-center">Đăng ký tài khoản <ArrowRight size={16} className="ml-1" /></Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;