import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, Upload, X, ShoppingCart } from 'lucide-react';
import { useAdminModal } from '../../hooks/useAdminModal';
import { AdminModal, ConfirmModal, LoadingOverlay } from '../../components/common/AdminModal';
import {
  FormInput,
  FormTextarea,
  FormSelect,
  FormActions,
  FormAlert,
} from '../../components/common/FormComponents';
import productApi from '../../api/productApi';
import categoryApi from '../../api/categoryApi';
import { getImageUrl } from '../../utils/imageUtils';

export default function ProductsAdmin() {
  const modal = useAdminModal();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    imageFile: null,
    imagePreview: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState(null);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        productApi.getAllClient(),
        categoryApi.getAllClient(),
      ]);
      
      const prods = Array.isArray(productsRes) ? productsRes : (productsRes.data || []);
      const cats = Array.isArray(categoriesRes) ? categoriesRes : (categoriesRes.data || []);
      
      setProducts(prods);
      setCategories(cats);
    } catch (error) {
      setAlertMessage({ type: 'error', text: 'Lỗi tải dữ liệu sản phẩm' });
    } finally {
      setLoading(false);
    }
  };

  // Handle form change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setFormErrors((prev) => ({ ...prev, imageFile: 'Vui lòng chọn file ảnh' }));
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors((prev) => ({ ...prev, imageFile: 'Kích thước ảnh không được vượt quá 5MB' }));
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          imageFile: file,
          imagePreview: reader.result,
        }));
        if (formErrors.imageFile) {
          setFormErrors((prev) => ({ ...prev, imageFile: null }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image
  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      imageFile: null,
      imagePreview: null,
    }));
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Tên sản phẩm không được trống';
    if (!formData.price || formData.price <= 0) errors.price = 'Giá phải lớn hơn 0';
    if (!formData.categoryId) errors.categoryId = 'Vui lòng chọn danh mục';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Add
  const handleAddClick = () => {
    setFormData({ name: '', description: '', price: '', categoryId: '', imageFile: null, imagePreview: null });
    setFormErrors({});
    modal.openAddForm({ name: '', description: '', price: '', categoryId: '', imageFile: null, imagePreview: null });
  };

  // Handle Edit
  const handleEditClick = (product) => {
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price || '',
      categoryId: product.categoryId || '',
      imageFile: null,
      imagePreview: product.imageUrl || null,
    });
    setFormErrors({});
    modal.openEditForm(product);
  };

  // Handle Delete Click
  const handleDeleteClick = (product) => {
    modal.openDeleteConfirm(`Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"?`);
    modal.setDeleteData({ productId: product.id });
  };

  // Handle Form Submit
  const handleFormSubmit = async () => {
    if (!validateForm()) return;

    modal.setLoading(true);
    try {
      const formDataToSend = new FormData();
      // Send product fields as form parameters
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', parseFloat(formData.price));
      formDataToSend.append('categoryId', parseInt(formData.categoryId));
      
      if (formData.imageFile) {
        formDataToSend.append('image', formData.imageFile);
      }

      if (modal.formData?.id) {
        // Edit mode
        await productApi.update(modal.formData.id, formDataToSend);
        setAlertMessage({ type: 'success', text: 'Cập nhật sản phẩm thành công' });
      } else {
        // Add mode
        await productApi.create(formDataToSend);
        setAlertMessage({ type: 'success', text: 'Thêm sản phẩm thành công' });
      }
      modal.closeFormModal();
      await loadData();
    } catch (error) {
      setAlertMessage({ type: 'error', text: 'Lỗi: ' + error.message });
    } finally {
      modal.setLoading(false);
    }
  };

  // Handle Delete Confirm
  const handleDeleteConfirm = async () => {
    modal.setLoading(true);
    try {
      await productApi.delete(modal.deleteData.productId);
      setAlertMessage({ type: 'success', text: 'Xóa sản phẩm thành công' });
      modal.closeDeleteConfirm();
      await loadData();
    } catch (error) {
      setAlertMessage({ type: 'error', text: 'Lỗi: ' + error.message });
    } finally {
      modal.setLoading(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter((prod) => {
    const matchSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = !filterCategory || prod.categoryId === parseInt(filterCategory);
    return matchSearch && matchCategory;
  });

  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : 'Không xác định';
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        <ShoppingCart className="admin-loading text-gray-400 mx-auto mb-4" size={48} />
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="admin-container space-y-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Sản Phẩm</h2>
          <p className="text-gray-600 mt-1">{filteredProducts.length} sản phẩm</p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
        >
          <Plus size={20} /> Thêm Sản Phẩm
        </button>
      </div>

      {/* Alert */}
      {alertMessage && (
        <FormAlert
          type={alertMessage.type}
          message={alertMessage.text}
          onClose={() => setAlertMessage(null)}
        />
      )}

      {/* Search & Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-4 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm transition"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm transition"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <ShoppingCart size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Không có sản phẩm nào</p>
          <p className="text-gray-400 text-sm mt-2">Hãy tạo sản phẩm đầu tiên để bắt đầu</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((prod, index) => (
            <div
              key={prod.id}
              className="admin-grid-item bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden group flex flex-col"
              style={{ '--index': index }}
            >
              {/* Image Container */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                {prod.imageUrl ? (
                  <img
                    src={getImageUrl(prod.imageUrl)}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect width="300" height="200" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-family="Arial" font-size="16" fill="%239ca3af"%3EKhông có ảnh%3C/text%3E%3C/svg%3E';
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ShoppingCart size={48} className="text-gray-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                    <button
                      onClick={() => handleEditClick(prod)}
                      className="p-3 bg-white rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(prod)}
                      className="p-3 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors"
                      title="Xóa"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-gray-900 truncate">{prod.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{getCategoryName(prod.categoryId)}</p>
                
                {/* Price */}
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <p className="text-2xl font-bold text-orange-600">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(prod.price)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">ID: {prod.id}</p>
                </div>

                {/* Quick Actions */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleEditClick(prod)}
                    className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-colors text-sm"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteClick(prod)}
                    className="flex-1 px-3 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors text-sm"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AdminModal
        isOpen={modal.isFormModalOpen}
        onClose={modal.closeFormModal}
        title={modal.formData?.id ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm'}
        size="lg"
      >
        <div className="space-y-4">
          <FormInput
            label="Tên Sản Phẩm"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            placeholder="Nhập tên sản phẩm"
            required
            error={formErrors.name}
          />

          <FormSelect
            label="Danh Mục"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleFormChange}
            options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
            placeholder="Chọn danh mục"
            required
            error={formErrors.categoryId}
          />

          <FormInput
            label="Giá (VND)"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleFormChange}
            placeholder="Nhập giá sản phẩm"
            required
            error={formErrors.price}
          />

          <FormTextarea
            label="Mô Tả"
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            placeholder="Nhập mô tả sản phẩm"
            rows={4}
          />

          {/* File Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Hình Ảnh</label>
            
            {/* Preview */}
            {(formData.imagePreview) && (
              <div className="relative w-32 h-32 rounded-lg border border-gray-300 overflow-hidden bg-gray-100">
                <img
                  src={formData.imagePreview.startsWith('data:') ? formData.imagePreview : getImageUrl(formData.imagePreview)}
                  alt="preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="128"%3E%3Crect width="128" height="128" fill="%23e5e7eb"/%3E%3C/svg%3E';
                  }}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Upload Input */}
            <label className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
              <div className="flex items-center gap-2 text-gray-600">
                <Upload size={20} />
                <span>Chọn ảnh từ máy</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {formErrors.imageFile && (
              <p className="text-sm text-red-600">{formErrors.imageFile}</p>
            )}
          </div>

          <FormActions
            onSubmit={handleFormSubmit}
            onCancel={modal.closeFormModal}
            isLoading={modal.loading}
            submitText={modal.formData?.id ? 'Cập Nhật' : 'Thêm'}
          />
        </div>
      </AdminModal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={modal.isDeleteConfirmOpen}
        onClose={modal.closeDeleteConfirm}
        onConfirm={handleDeleteConfirm}
        title="Xác nhận xóa"
        message={modal.deleteMessage}
        confirmText="Xóa"
        cancelText="Hủy"
        isDangerous={true}
        isLoading={modal.loading}
      />

      {/* Loading Overlay */}
      <LoadingOverlay isVisible={modal.loading && modal.isFormModalOpen} message="Đang xử lý..." />
    </div>
  );
}
