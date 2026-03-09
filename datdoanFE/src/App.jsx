import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import Login from './pages/client/Login.jsx';
import Register from './pages/client/Register.jsx';
import Home from './pages/client/Home.jsx';
import Profile from './pages/client/Profile.jsx';
import Cart from './pages/client/Cart.jsx';
import AdminLayout from './components/layout/AdminLayout.jsx';
import Checkout from './pages/client/Checkout.jsx';
import Menu from './pages/client/Menu.jsx';
import Header from './components/layout/Header.jsx';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
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
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;