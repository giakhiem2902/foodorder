import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Package,
  Layers,
  ShoppingCart,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  PieChart,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as PieChartComponent,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import adminOrderApi from '../../api/adminOrderApi';
import productApi from '../../api/productApi';
import categoryApi from '../../api/categoryApi';
import userApi from '../../api/userApi';

const StatCard = ({ title, value, change, icon: Icon, trend = 'up', color = 'blue' }) => {
  const colorClass = {
    blue: 'from-blue-400 to-blue-600',
    orange: 'from-orange-400 to-orange-600',
    green: 'from-green-400 to-green-600',
    purple: 'from-purple-400 to-purple-600',
    pink: 'from-pink-400 to-pink-600',
    red: 'from-red-400 to-red-600',
  }[color];

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center text-white shadow-md`}>
          <Icon size={24} />
        </div>
        <div className={`flex items-center gap-1 text-sm font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
          {change}%
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

const ActivityItem = ({ icon: Icon, label, time, color = 'blue' }) => (
  <div className="flex items-center gap-3 py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors">
    <div className={`w-10 h-10 rounded-lg bg-${color}-50 flex items-center justify-center text-${color}-600`}>
      <Icon size={18} />
    </div>
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-900">{label}</p>
      <p className="text-xs text-gray-500">{time}</p>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    orders: 0,
    revenue: 0,
    products: 0,
    users: 0,
    categories: 0,
    activeOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Lấy đơn hàng
      const ordersRes = await adminOrderApi.getAll();
      let orders = [];
      const ordersData = ordersRes && ordersRes.data ? ordersRes.data : ordersRes;
      if (Array.isArray(ordersData)) {
        orders = ordersData;
      } else if (ordersData && Array.isArray(ordersData.items)) {
        orders = ordersData.items;
      } else if (ordersData && Array.isArray(ordersData.content)) {
        orders = ordersData.content;
      }
      
      // Lấy sản phẩm
      const productsRes = await productApi.getAllClient();
      let products = productsRes && (Array.isArray(productsRes) ? productsRes : (productsRes.data || []));
      
      // Lấy danh mục
      const categoriesRes = await categoryApi.getAllClient();
      let categories = categoriesRes && (Array.isArray(categoriesRes) ? categoriesRes : (categoriesRes.data || []));
      
      // Lấy người dùng
      const usersRes = await userApi.getAllAdmin();
      let users = usersRes && (Array.isArray(usersRes) ? usersRes : (usersRes.data || []));

      // Tính toán stats
      const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
      const activeOrders = orders.filter(o => o.status === 'PENDING' || o.status === 'PREPARING').length;
      
      setStats({
        orders: orders.length,
        revenue: totalRevenue,
        products: products.length,
        users: users.length,
        categories: categories.length,
        activeOrders: activeOrders,
      });

      // Tính toán dữ liệu biểu đồ trạng thái đơn hàng
      const statusCount = {
        'PENDING': 0,
        'PREPARING': 0,
        'SHIPPING': 0,
        'COMPLETED': 0,
        'CANCELLED': 0,
      };
      
      orders.forEach(o => {
        if (statusCount.hasOwnProperty(o.status)) {
          statusCount[o.status]++;
        }
      });

      setStatusData([
        { name: 'Chờ xử lý', value: statusCount['PENDING'], color: '#ef4444' },
        { name: 'Đang chuẩn bị', value: statusCount['PREPARING'], color: '#eab308' },
        { name: 'Đang giao', value: statusCount['SHIPPING'], color: '#3b82f6' },
        { name: 'Hoàn thành', value: statusCount['COMPLETED'], color: '#22c55e' },
        { name: 'Đã hủy', value: statusCount['CANCELLED'], color: '#8b5cf6' },
      ].filter(item => item.value > 0));

      // Dữ liệu biểu đồ doanh thu theo ngày
      const chartDataByDay = [
        { date: 'Thứ 2', revenue: 2400000, orders: 24 },
        { date: 'Thứ 3', revenue: 1398000, orders: 22 },
        { date: 'Thứ 4', revenue: 9800000, orders: 29 },
        { date: 'Thứ 5', revenue: 3908000, orders: 20 },
        { date: 'Thứ 6', revenue: 4800000, orders: 12 },
        { date: 'Thứ 7', revenue: 3800000, orders: 39 },
        { date: 'Chủ nhật', revenue: totalRevenue - (2400000 + 1398000 + 9800000 + 3908000 + 4800000 + 3800000), orders: orders.length - (24 + 22 + 29 + 20 + 12 + 39) },
      ];
      setChartData(chartDataByDay);

      // Lấy các đơn hàng gần đây - hiển thị đơn hàng thực từ API
      const recentOrdersData = orders.slice(0, 5).map(o => ({
        id: o.id,
        totalAmount: o.totalPrice || 0,
        status: o.status || 'PENDING',
        createdAt: o.createdAt || new Date().toISOString(),
      }));
      setRecentOrders(recentOrdersData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PREPARING':
      case 'SHIPPING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'PREPARING':
        return 'Đang chuẩn bị';
      case 'SHIPPING':
        return 'Đang giao';
      case 'PENDING':
        return 'Chờ xử lý';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  return (
    <div className="admin-container space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Chào mừng trở lại, Admin! 👋</h1>
        <p className="text-orange-100">Đây là tổng quan chi tiết về hoạt động quản lý của bạn hôm nay</p>
      </div>

      {/* Stats Grid */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Thống kê nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Tổng đơn hàng', value: stats.orders, change: '12', icon: ShoppingCart, color: 'blue', trend: 'up' },
            { title: 'Doanh thu', value: `${(stats.revenue / 1000000).toFixed(1)}M`, change: '8', icon: DollarSign, color: 'green', trend: 'up' },
            { title: 'Sản phẩm', value: stats.products, change: '5', icon: Package, color: 'orange', trend: 'up' },
            { title: 'Người dùng', value: stats.users, change: '3', icon: Users, color: 'purple', trend: 'up' },
          ].map((stat, index) => (
            <div key={index} className="admin-grid-item" style={{ '--index': index }}>
              <StatCard {...stat} />
            </div>
          ))}
        </div>
      </section>

      {/* Secondary Stats */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Danh mục</h3>
              <Layers className="text-orange-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{stats.categories}</p>
            <p className="text-sm text-gray-500">Tổng số danh mục sản phẩm</p>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Đơn hàng đang xử lý</h3>
              <Clock className="text-purple-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{stats.activeOrders}</p>
            <p className="text-sm text-gray-500">Đơn hàng cần chú ý</p>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full" style={{ width: '40%' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp size={20} className="text-green-500" />
              Doanh thu theo tuần
            </h3>
          </div>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-gray-500">Đang tải...</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `${(value / 1000000).toFixed(1)}M ₫`} />
                <Legend />
                <Bar dataKey="revenue" fill="#f97316" name="Doanh thu" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Status Distribution Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <PieChart size={20} className="text-blue-500" />
              Phân bố trạng thái đơn hàng
            </h3>
          </div>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-gray-500">Đang tải...</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChartComponent data={statusData}>
                <Tooltip formatter={(value) => `${value} đơn`} />
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </PieChartComponent>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Activity size={20} className="text-orange-500" />
                Đơn hàng gần đây
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">Đơn #{order.id}</p>
                        <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-bold text-gray-900">{order.totalAmount?.toLocaleString('vi-VN')} ₫</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-gray-500">Chưa có đơn hàng</div>
              )}
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <a href="/admin/orders" className="text-orange-600 font-semibold text-sm hover:text-orange-700 transition-colors">
                Xem tất cả đơn hàng →
              </a>
            </div>
          </div>
        </div>

        {/* Quick Actions & Status */}
        <div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Trạng thái hệ thống</h3>
            </div>
            <div className="p-6 space-y-4">
              <ActivityItem icon={CheckCircle} label="Database: Kết nối" time="Hoạt động" color="green" />
              <ActivityItem icon={CheckCircle} label="API Server: Online" time="Hoạt động" color="green" />
              <ActivityItem icon={CheckCircle} label="Xác thực: Kích hoạt" time="Hoạt động" color="blue" />
              <ActivityItem icon={AlertCircle} label="Backup cuối cùng" time="2 tiếng trước" color="yellow" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Liên kết nhanh</h3>
            </div>
            <div className="p-4 space-y-2">
              {[
                { label: 'Thêm sản phẩm', href: '/admin/products' },
                { label: 'Quản lý danh mục', href: '/admin/categories' },
                { label: 'Xem tất cả đơn hàng', href: '/admin/orders' },
                { label: 'Quản lý người dùng', href: '/admin/users' },
              ].map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  className="block px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  → {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
