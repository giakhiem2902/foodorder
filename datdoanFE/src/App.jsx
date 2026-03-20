import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import Login from './pages/client/Login.jsx';
import Register from './pages/client/Register.jsx';
import Home from './pages/client/Home.jsx';
import Profile from './pages/client/Profile.jsx';
import Cart from './pages/client/Cart.jsx';
import AdminLayout from './components/layout/AdminLayout.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ProductsAdmin from './pages/admin/ProductsAdmin.jsx';
import CategoriesAdmin from './pages/admin/CategoriesAdmin.jsx';
import OrdersAdmin from './pages/admin/OrdersAdmin.jsx';
import UsersAdmin from './pages/admin/UsersAdmin.jsx';
import Checkout from './pages/client/Checkout.jsx';
import Menu from './pages/client/Menu.jsx';
import Header from './components/layout/Header.jsx';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Header />}
      <Routes>
        {/* Public Routes - Khách hàng truy cập tự do */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/menu" element={<Menu />} />

        {/* Private Routes - Bảo vệ trang Admin */}
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="" element={<AdminDashboard />} />
          <Route path="products" element={<ProductsAdmin />} />
          <Route path="categories" element={<CategoriesAdmin />} />
          <Route path="orders" element={<OrdersAdmin />} />
          <Route path="users" element={<UsersAdmin />} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;