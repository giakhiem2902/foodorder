import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  ShoppingCart,
  Package,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
} from 'lucide-react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/users', label: 'Người dùng', icon: Users },
    { path: '/admin/categories', label: 'Danh mục', icon: FolderOpen },
    { path: '/admin/products', label: 'Món ăn', icon: ShoppingCart },
    { path: '/admin/orders', label: 'Đơn hàng', icon: Package },
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const bgClass = isDarkMode ? 'bg-gray-950' : 'bg-gray-50';
  const sidebarBgClass = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const borderClass = isDarkMode ? 'border-gray-800' : 'border-gray-200';
  const menuBgClass = isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100';

  return (
    <div className={`flex min-h-screen ${bgClass} transition-colors duration-300`}>
      {/* Sidebar */}
      <aside
        className={`${sidebarBgClass} ${sidebarOpen ? 'w-64' : 'w-20'} fixed left-0 top-0 h-screen border-r ${borderClass} transition-all duration-300 z-40 flex flex-col shadow-lg`}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center w-full'}`}>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center flex-shrink-0">
                <ShoppingCart className="text-white" size={24} />
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    FoodAdmin
                  </h1>
                  <p className="text-xs text-gray-500">v1.0</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-1 rounded-lg ${menuBgClass} transition-colors ${!sidebarOpen && 'hidden'}`}
            >
              <X size={18} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  active
                    ? isDarkMode
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                      : 'bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-md'
                    : isDarkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 font-medium">{item.label}</span>
                    {active && <ChevronRight size={16} className="opacity-50" />}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={`px-4 py-6 border-t ${borderClass} space-y-3`}>
          {/* Theme Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${menuBgClass} transition-colors`}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            {sidebarOpen && <span className="text-sm">{isDarkMode ? 'Sáng' : 'Tối'}</span>}
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 ${menuBgClass} transition-colors hover:text-red-700 font-medium`}
            title="Đăng xuất"
          >
            <LogOut size={18} />
            {sidebarOpen && <span className="text-sm">Đăng xuất</span>}
          </button>

          {/* Expand/Collapse Button */}
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className={`w-full flex justify-center py-2 ${menuBgClass} rounded-lg transition-colors`}
            >
              <Menu size={18} />
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Top Header */}
        <header
          className={`${sidebarBgClass} border-b ${borderClass} px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm`}
        >
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className={`p-2 rounded-lg ${menuBgClass} transition-colors`}
              >
                <Menu size={20} />
              </button>
            )}
            <div>
              <h2 className={`text-2xl font-bold ${textClass}`}>
                {menuItems.find((item) => isActive(item.path))?.label || 'Dashboard'}
              </h2>
              <p className="text-sm text-gray-500">Quản lý nội dung ứng dụng FoodApp</p>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <p className="text-sm font-medium text-gray-600">
                {new Date().toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold cursor-pointer hover:shadow-lg transition-shadow">
              A
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 px-8 py-8 overflow-auto bg-inherit">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;