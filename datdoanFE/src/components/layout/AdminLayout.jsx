// src/layouts/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-slate-800 text-white p-6">
        <h2 className="text-xl font-bold">Admin FoodApp</h2>
        {/* Menu admin ở đây */}
      </aside>
      <main className="flex-1 p-8">
        <Outlet /> {/* Nơi hiển thị các trang con như Quản lý đơn hàng, Sản phẩm */}
      </main>
    </div>
  );
};

export default AdminLayout;