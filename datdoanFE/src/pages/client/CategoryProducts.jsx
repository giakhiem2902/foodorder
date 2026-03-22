import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/cartSlice.js';
import productApi from '../../api/productApi.js';

const CategoryProducts = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await productApi.getByCategory(id);
        setProducts(data);
      } catch (error) { 
        console.error("Lỗi khi lấy danh sách món ăn:", error); 
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [id]);
  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    alert(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Đang tải món ăn...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h2 className="text-2xl font-bold text-gray-800">Thực đơn món ăn</h2>
        <span className="text-gray-500 text-sm">{products.length} món được tìm thấy</span>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Hiện tại danh mục này chưa có món ăn nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div 
              key={product.id} 
              className="bg-white rounded-lg shadow p-4 border border-transparent hover:border-primary hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              {/* Ảnh món ăn - Kết nối với folder uploads của BE */}
              <div className="relative h-40 w-full mb-3 overflow-hidden rounded-md">
                <img 
                  src={`http://localhost:8080${product.imageUrl}`} 
                  alt={product.name}
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500" 
                />
              </div>

              <div className="flex-grow">
                <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2 min-h-[40px]">
                  {product.description || "Món ăn đặc sắc của chúng tôi."}
                </p>
                <p className="text-primary font-bold text-xl mt-2">
                  {product.price.toLocaleString('vi-VN')}đ
                </p>
              </div>

              <button 
                onClick={() => handleAddToCart(product)}
                className="mt-4 w-full bg-primary text-white py-2.5 rounded-lg font-semibold hover:bg-orange-600 active:scale-95 transition-all"
              >
                Thêm vào giỏ
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;