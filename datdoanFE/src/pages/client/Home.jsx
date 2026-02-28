import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ShoppingCart,
  User,
  LogOut,
  Navigation,
} from "lucide-react";

import productApi from "../../api/productApi.js";
import { addToCart } from "../../redux/cartSlice.js";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const featuredProducts = products.slice(0, 6);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // ================= LOAD DATA =================
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const loadProducts = async () => {
      try {
        setLoadingProducts(true);

        const data = await productApi.getAllClient();

        console.log("PRODUCT DATA:", data);

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  // ================= ADD TO CART =================
  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    alert(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  return (
    <div className="w-full bg-white min-h-screen font-sans">

      {/* ================= HEADER ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">

          <Link to="/" className="text-3xl font-black text-primary">
            SmartFood
          </Link>

          <nav className="hidden md:flex gap-8 font-semibold text-gray-600">
            <a href="#about" className="hover:text-primary">Giới thiệu</a>
            <a href="#menu" className="hover:text-primary">Thực đơn</a>
            <a href="#contact" className="hover:text-primary">Liên hệ</a>
          </nav>

          <div className="flex items-center gap-6">
            <Link to="/cart" className="relative">
              <ShoppingCart size={26} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

        </div>
      </header>


      {/* ================= HERO ================= */}
      <section className="h-screen flex items-center justify-center bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?auto=format&fit=crop&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative text-center text-white z-10 px-6">
          <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
            Món Ngon Chuẩn Vị <br />
            <span className="text-primary italic">Giao Tận Nơi</span>
          </h1>

          <p className="text-lg text-gray-200 max-w-xl mx-auto mb-8">
            Thưởng thức những món ăn chất lượng nhà hàng ngay tại nhà bạn.
          </p>

          <Link
            to="/menu"
            className="bg-primary px-8 py-4 rounded-full text-lg font-bold hover:scale-105 transition"
          >
            Xem Thực Đơn
          </Link>
        </div>
      </section>


      {/* ================= ABOUT ================= */}
      <section id="about" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <img
            src="https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&q=80"
            className="rounded-3xl shadow-lg"
            alt=""
          />

          <div>
            <h2 className="text-4xl font-black mb-6">
              Về SmartFood
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              SmartFood mang đến trải nghiệm ẩm thực hiện đại,
              nguyên liệu tươi ngon và quy trình chế biến đạt chuẩn.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Chúng tôi cam kết giao hàng nhanh chóng, an toàn và tiện lợi.
            </p>
          </div>
        </div>
      </section>


      {/* ================= FEATURED PRODUCTS ================= */}
      <section id="menu" className="py-24">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-4xl font-black text-center mb-16 uppercase">
            Món Gợi Ý
          </h2>

          {featuredProducts.length === 0 ? (
            <div className="text-center text-gray-500">
              Không có sản phẩm.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl shadow hover:shadow-2xl transition overflow-hidden group"
                >
                  <div className="h-60 overflow-hidden">
                    <img
                      src={
                        product.imageUrl
                          ? `http://localhost:8080${product.imageUrl}`
                          : "/default-food.png"
                      }
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      alt={product.name}
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">
                      {product.name}
                    </h3>

                    <p className="text-gray-500 text-sm mb-4">
                      {product.description?.slice(0, 60)}...
                    </p>

                    <div className="flex justify-between items-center">
                      <span className="text-primary font-bold text-lg">
                        {Number(product.price || 0).toLocaleString("vi-VN")}đ
                      </span>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-gray-900 text-white p-3 rounded-xl hover:bg-primary transition"
                      >
                        <ShoppingCart size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-16">
            <Link
              to="/menu"
              className="border-2 border-primary text-primary px-8 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition"
            >
              Xem tất cả món
            </Link>
          </div>

        </div>
      </section>


      {/* ================= FOOTER ================= */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-4">SmartFood</h3>
          <p className="text-gray-400">
            © 2025 SmartFood. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default Home;