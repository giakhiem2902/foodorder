import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userApi from '../../api/userApi.js';
import { useAuth } from '../../context/AuthContext.jsx';

const Profile = () => {
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    address: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await userApi.getProfile();
        setForm({
          username: data.username || '',
          fullName: data.fullName || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || ''
        });
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        address: form.address
      };
      const updated = await userApi.updateProfile(payload);
      // update localStorage user so header/profile panel shows latest
      try {
        const raw = localStorage.getItem('user');
        const parsed = raw ? JSON.parse(raw) : {};
        const newUser = { ...parsed, ...updated };
        localStorage.setItem('user', JSON.stringify(newUser));
      } catch (err) {
        // ignore
      }
      setSuccess('Cập nhật thông tin thành công');
      // keep on page, show success then clear
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Update failed', err);
      alert('Cập nhật thất bại');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Đang tải...</div>;

  return (
    <div className="w-full min-h-screen flex bg-white">
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80" 
            className="w-full h-full object-cover opacity-30 scale-110" 
            alt="Profile" 
          />
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/80 to-primary/40"></div>
        </div>
        <div className="relative z-10 text-white max-w-lg">
          <h1 className="text-4xl font-black mb-4">Thông tin cá nhân</h1>
          <p className="text-lg opacity-90">Cập nhật thông tin để nhận thông báo, đơn hàng và trải nghiệm tốt hơn.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-gray-50 lg:bg-white">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-black mb-4">Thông tin cá nhân</h2>
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-xl mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-bold text-gray-700 ml-1">Tên đăng nhập</label>
              <input name="username" value={form.username} readOnly className="mt-1 block w-full pl-4 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none" />
            </div>

            <div>
              <label className="text-sm font-bold text-gray-700 ml-1">Họ và tên</label>
              <input name="fullName" value={form.fullName} onChange={handleChange} className="mt-1 block w-full pl-4 pr-4 py-4 bg-white border border-gray-100 rounded-2xl outline-none" />
            </div>

            <div>
              <label className="text-sm font-bold text-gray-700 ml-1">Email</label>
              <input name="email" value={form.email} onChange={handleChange} className="mt-1 block w-full pl-4 pr-4 py-4 bg-white border border-gray-100 rounded-2xl outline-none" />
            </div>

            <div>
              <label className="text-sm font-bold text-gray-700 ml-1">Số điện thoại</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="mt-1 block w-full pl-4 pr-4 py-4 bg-white border border-gray-100 rounded-2xl outline-none" />
            </div>

            <div>
              <label className="text-sm font-bold text-gray-700 ml-1">Địa chỉ</label>
              <input name="address" value={form.address} onChange={handleChange} className="mt-1 block w-full pl-4 pr-4 py-4 bg-white border border-gray-100 rounded-2xl outline-none" />
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="w-full py-4 px-6 bg-primary hover:bg-orange-600 disabled:bg-orange-300 text-white font-black rounded-2xl shadow-xl transition-all">
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => navigate('/')} className="text-sm text-gray-500">Quay lại trang chủ</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
