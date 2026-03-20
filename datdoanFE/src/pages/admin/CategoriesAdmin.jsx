import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, Upload, X, FolderOpen } from 'lucide-react';
import { useAdminModal } from '../../hooks/useAdminModal';
import { AdminModal, ConfirmModal, LoadingOverlay } from '../../components/common/AdminModal';
import {
  FormInput,
  FormTextarea,
  FormActions,
  FormAlert,
} from '../../components/common/FormComponents';
import categoryApi from '../../api/categoryApi';
import { getImageUrl } from '../../utils/imageUtils';

export default function CategoriesAdmin() {
  const modal = useAdminModal();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ name: '', imageFile: null, imagePreview: null });
  const [formErrors, setFormErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState(null);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryApi.getAllClient();
      const data = Array.isArray(res) ? res : (res.data ? res.data : []);
      setCategories(data);
    } catch (error) {
      setAlertMessage({ type: 'error', text: 'Lỗi tải danh mục' });
    } finally {
      setLoading(false);
    }
  };

  // Handle form input change
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
    if (!formData.name.trim()) errors.name = 'Tên danh mục không được trống';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Add
  const handleAddClick = () => {
    setFormData({ name: '', imageFile: null, imagePreview: null });
    setFormErrors({});
    modal.openAddForm({ name: '', imageFile: null, imagePreview: null });
  };

  // Handle Edit
  const handleEditClick = (category) => {
    setFormData({ 
      name: category.name, 
      imageFile: null, 
      imagePreview: category.imageUrl || null 
    });
    setFormErrors({});
    modal.openEditForm(category);
  };

  // Handle Delete Click
  const handleDeleteClick = (category) => {
    modal.openDeleteConfirm(`Bạn có chắc chắn muốn xóa danh mục "${category.name}"? Hành động này không thể hoàn tác.`);
    modal.setDeleteData({ categoryId: category.id });
  };

  // Handle Form Submit
  const handleFormSubmit = async () => {
    if (!validateForm()) return;

    modal.setLoading(true);
    try {
      const formDataToSend = new FormData();
      // Send category fields as form parameters, not as a JSON string
      formDataToSend.append('name', formData.name);
      
      if (formData.imageFile) {
        formDataToSend.append('image', formData.imageFile);
      }

      if (modal.formData?.id) {
        // Edit mode
        await categoryApi.update(modal.formData.id, formDataToSend);
        setAlertMessage({ type: 'success', text: 'Cập nhật danh mục thành công' });
      } else {
        // Add mode
        await categoryApi.create(formDataToSend);
        setAlertMessage({ type: 'success', text: 'Thêm danh mục thành công' });
      }
      modal.closeFormModal();
      await loadCategories();
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
      await categoryApi.delete(modal.deleteData.categoryId);
      setAlertMessage({ type: 'success', text: 'Xóa danh mục thành công' });
      modal.closeDeleteConfirm();
      await loadCategories();
    } catch (error) {
      setAlertMessage({ type: 'error', text: 'Lỗi: ' + error.message });
    } finally {
      modal.setLoading(false);
    }
  };

  // Filter categories
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        <FolderOpen className="admin-loading text-gray-400 mx-auto mb-4" size={48} />
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="admin-container space-y-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Danh Mục Sản Phẩm</h2>
          <p className="text-gray-600 mt-1">{filteredCategories.length} danh mục</p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
        >
          <Plus size={20} /> Thêm Danh Mục
        </button>
      </div>

      {/* Alert Message */}
      {alertMessage && (
        <FormAlert
          type={alertMessage.type}
          message={alertMessage.text}
          onClose={() => setAlertMessage(null)}
        />
      )}

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-4 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Tìm kiếm danh mục..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm transition"
        />
      </div>

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <FolderOpen size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Không có danh mục nào</p>
          <p className="text-gray-400 text-sm mt-2">Hãy tạo danh mục đầu tiên để bắt đầu</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat, index) => (
            <div
              key={cat.id}
              className="admin-grid-item bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden group"
              style={{ '--index': index }}
            >
              {/* Image Container */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                {cat.imageUrl ? (
                  <img
                    src={getImageUrl(cat.imageUrl)}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect width="300" height="200" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-family="Arial" font-size="16" fill="%239ca3af"%3EKhông có ảnh%3C/text%3E%3C/svg%3E';
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FolderOpen size={48} className="text-gray-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                    <button
                      onClick={() => handleEditClick(cat)}
                      className="p-3 bg-white rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(cat)}
                      className="p-3 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors"
                      title="Xóa"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 truncate">{cat.name}</h3>
                <p className="text-sm text-gray-500 mt-2">ID: {cat.id}</p>
                
                {/* Quick Actions */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleEditClick(cat)}
                    className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-colors text-sm"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteClick(cat)}
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
        title={modal.formData?.id ? 'Sửa danh mục' : 'Thêm danh mục'}
        size="md"
      >
        <div className="space-y-4">
          <FormInput
            label="Tên Danh Mục"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            placeholder="Nhập tên danh mục"
            required
            error={formErrors.name}
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
            submitText={modal.formModalMode === 'add' ? 'Thêm' : 'Cập Nhật'}
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
