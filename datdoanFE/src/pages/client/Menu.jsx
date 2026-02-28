import React, { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Search, Flame, ShoppingCart } from "lucide-react";
import productApi from "../../api/productApi";
import { addToCart } from "../../redux/cartSlice";

const Menu = () => {
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [onlyHot, setOnlyHot] = useState(false);

  // ================= LOAD DATA =================
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await productApi.getAllClient();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Lỗi load sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ================= CATEGORY LIST (FIX CHUẨN) =================
  const categories = useMemo(() => {
    const map = new Map();

    products.forEach((p) => {
      if (p.categoryId && p.categoryName) {
        map.set(p.categoryId, p.categoryName);
      }
    });

    return Array.from(map, ([id, name]) => ({ id, name }));
  }, [products]);

  // ================= FILTER LOGIC =================
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchSearch = product.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchCategory =
        selectedCategory === "all" ||
        product.categoryId === Number(selectedCategory);

      const matchPrice =
        priceRange === "all" ||
        (priceRange === "low" && product.price < 50000) ||
        (priceRange === "mid" &&
          product.price >= 50000 &&
          product.price <= 100000) ||
        (priceRange === "high" && product.price > 100000);

      const matchHot = !onlyHot || product.isHot === true;

      return matchSearch && matchCategory && matchPrice && matchHot;
    });
  }, [products, searchTerm, selectedCategory, priceRange, onlyHot]);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-black mb-4">Thực Đơn</h1>
          <p className="text-gray-500">
            Khám phá tất cả món ăn tại SmartFood
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-10">

          {/* SIDEBAR */}
          <div className="bg-white p-6 rounded-3xl shadow-md h-fit">

            {/* SEARCH */}
            <div className="relative mb-6">
              <Search size={18} className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm món..."
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* CATEGORY */}
            <div className="mb-6">
              <h3 className="font-bold mb-3">Danh mục</h3>
              <select
                className="w-full border rounded-xl p-2"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">Tất cả</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* PRICE */}
            <div className="mb-6">
              <h3 className="font-bold mb-3">Lọc theo giá</h3>
              <select
                className="w-full border rounded-xl p-2"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              >
                <option value="all">Tất cả</option>
                <option value="low">Dưới 50.000đ</option>
                <option value="mid">50.000đ - 100.000đ</option>
                <option value="high">Trên 100.000đ</option>
              </select>
            </div>

            {/* HOT */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={onlyHot}
                onChange={() => setOnlyHot(!onlyHot)}
              />
              <span className="flex items-center gap-1 font-medium">
                <Flame size={16} className="text-red-500" />
                Chỉ món HOT
              </span>
            </div>

          </div>

          {/* PRODUCT GRID */}
          <div className="md:col-span-3">

            {loading ? (
              <div className="text-center py-20 text-gray-500">
                Đang tải...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                Không tìm thấy sản phẩm phù hợp.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-3xl shadow hover:shadow-2xl transition overflow-hidden group"
                  >
                    <div className="h-56 overflow-hidden">
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

                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-2">
                        {product.name}
                      </h3>

                      <p className="text-gray-500 text-sm mb-4">
                        {product.description?.slice(0, 60)}...
                      </p>

                      <div className="flex justify-between items-center">
                        <span className="text-primary font-bold">
                          {Number(product.price).toLocaleString("vi-VN")}đ
                        </span>

                        <button
                          onClick={() => handleAddToCart(product)}
                          className="bg-gray-900 text-white p-2 rounded-xl hover:bg-primary transition"
                        >
                          <ShoppingCart size={18} />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default Menu;