import React, { useEffect, useState } from 'react';
import { Search, Edit2, Trash2, Users, Plus } from 'lucide-react';
import { useAdminModal } from '../../hooks/useAdminModal';
import { AdminModal, ConfirmModal, LoadingOverlay } from '../../components/common/AdminModal';
import { FormInput, FormTextarea, FormSelect, FormActions, FormAlert } from '../../components/common/FormComponents';
import userApi from '../../api/userApi';

const ROLE_OPTIONS = [
  { value: 'USER', label: 'User' },
  { value: 'ADMIN', label: 'Admin' },
];

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const modal = useAdminModal();

  // Helper function to get display role from roles array
  const getDisplayRole = (roles) => {
    if (!roles || roles.length === 0) return 'USER';
    const roleString = roles[0]; // Get first role
    // Remove 'ROLE_' prefix if present
    return roleString.replace('ROLE_', '');
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user => {
      const search = searchTerm.toLowerCase();
      return (
        (user.username && user.username.toLowerCase().includes(search)) ||
        (user.email && user.email.toLowerCase().includes(search)) ||
        (user.fullName && user.fullName.toLowerCase().includes(search))
      );
    });
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userApi.getAllAdmin();
      const data = res && res.data ? res.data : res;
      setUsers(Array.isArray(data) ? data : []);
      setFilteredUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      modal.showAlert(`Error loading users: ${err.response?.data?.message || err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddForm = () => {
    modal.openAddForm({
      username: '',
      email: '',
      fullName: '',
      phone: '',
      address: '',
      password: '',
      role: 'USER',
    });
  };

  const handleOpenEditForm = (user) => {
    // Extract the first role from roles array, removing 'ROLE_' prefix if present
    let role = 'USER';
    if (user.roles && user.roles.length > 0) {
      const roleString = user.roles[0];
      role = roleString.replace('ROLE_', '');
    }
    
    modal.openEditForm({
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName || '',
      phone: user.phone || '',
      address: user.address || '',
      role: role,
    });
  };

  const handleOpenDeleteConfirm = (user) => {
    modal.openDeleteConfirm(`Delete user "${user.username}"?`);
    modal.setDeleteData({ userId: user.id, username: user.username });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!modal.formData.username?.trim()) {
      modal.showAlert('Username is required', 'error');
      return;
    }
    if (!modal.formData.email?.trim()) {
      modal.showAlert('Email is required', 'error');
      return;
    }

    try {
      modal.setLoading(true);

      if (modal.formData.id) {
        // Update
        await userApi.updateAdmin(modal.formData.id, {
          username: modal.formData.username,
          email: modal.formData.email,
          fullName: modal.formData.fullName,
          phone: modal.formData.phone,
          address: modal.formData.address,
        });
        modal.showAlert('User updated successfully', 'success');
      } else {
        // Create
        await userApi.createAdmin({
          username: modal.formData.username,
          email: modal.formData.email,
          fullName: modal.formData.fullName,
          phone: modal.formData.phone,
          address: modal.formData.address,
          password: modal.formData.password || modal.formData.username + '123',
        });
        modal.showAlert('User created successfully', 'success');
      }

      modal.closeFormModal();
      fetchUsers();
    } catch (err) {
      modal.showAlert(`Error: ${err.response?.data?.message || err.message}`, 'error');
    } finally {
      modal.setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      modal.setLoading(true);
      await userApi.deleteAdmin(modal.deleteData.userId);
      modal.showAlert('User deleted successfully', 'success');
      modal.closeDeleteConfirm();
      fetchUsers();
    } catch (err) {
      modal.showAlert(`Error: ${err.response?.data?.message || err.message}`, 'error');
    } finally {
      modal.setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Quản Lý Người Dùng</h2>
        <p className="text-gray-600 mt-1">{filteredUsers.length} người dùng trong hệ thống</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white shadow-md">
              <Users size={24} />
            </div>
            <span className="text-sm font-semibold text-green-600">↑ 5%</span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Tổng người dùng</h3>
          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white shadow-md">
              <Edit2 size={24} />
            </div>
            <span className="text-sm font-semibold text-red-600">Admin</span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Quản trị viên</h3>
          <p className="text-2xl font-bold text-gray-900">
            {users.filter(u => getDisplayRole(u.roles) === 'ADMIN').length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white shadow-md">
              <Users size={24} />
            </div>
            <span className="text-sm font-semibold text-green-600">User</span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Người dùng thường</h3>
          <p className="text-2xl font-bold text-gray-900">
            {users.filter(u => getDisplayRole(u.roles) === 'USER').length}
          </p>
        </div>
      </div>

      {/* Alert */}
      {modal.alert && (
        <FormAlert
          message={modal.alert.message}
          type={modal.alert.type}
          onClose={() => modal.setAlert(null)}
        />
      )}

      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên đăng nhập, email, hoặc tên đầy đủ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm transition"
          />
        </div>
        <button
          onClick={handleOpenAddForm}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
        >
          <Plus size={20} /> Thêm Người Dùng
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <Users className="text-gray-300 mx-auto mb-4" size={48} />
            <p>Đang tải người dùng...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Users className="text-gray-300 mx-auto mb-4" size={48} />
            <p className="text-lg">Không có người dùng nào</p>
            <p className="text-sm mt-2">Bắt đầu tạo người dùng mới</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tên Đăng Nhập</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tên Đầy Đủ</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Vai Trò</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Điện Thoại</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.username}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.fullName || '-'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-4 py-1 rounded-full text-xs font-semibold inline-block ${
                        getDisplayRole(user.roles) === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {getDisplayRole(user.roles) === 'ADMIN' ? 'Quản Trị' : 'Người Dùng'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.phone || '-'}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleOpenEditForm(user)}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteConfirm(user)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modal.formData && (
        <AdminModal isOpen={modal.isFormModalOpen} onClose={modal.closeFormModal} title={modal.formData?.id ? 'Chỉnh Sửa Người Dùng' : 'Thêm Người Dùng'}>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <FormInput
              label="Tên Đăng Nhập"
              value={modal.formData.username || ''}
              onChange={(value) => modal.setFormData({ ...modal.formData, username: value })}
              required
            />
            <FormInput
              label="Email"
              type="email"
              value={modal.formData.email || ''}
              onChange={(value) => modal.setFormData({ ...modal.formData, email: value })}
              required
            />
            {!modal.formData.id && (
              <FormInput
                label="Mật Khẩu (Tùy chọn)"
                type="password"
                value={modal.formData.password || ''}
                onChange={(value) => modal.setFormData({ ...modal.formData, password: value })}
                placeholder="Để trống để dùng mật khẩu mặc định"
              />
            )}
            <FormInput
              label="Tên Đầy Đủ"
              value={modal.formData.fullName || ''}
              onChange={(value) => modal.setFormData({ ...modal.formData, fullName: value })}
            />
            <FormInput
              label="Điện Thoại"
              value={modal.formData.phone || ''}
              onChange={(value) => modal.setFormData({ ...modal.formData, phone: value })}
            />
            <FormTextarea
              label="Địa Chỉ"
              value={modal.formData.address || ''}
              onChange={(value) => modal.setFormData({ ...modal.formData, address: value })}
            />
            <FormSelect
              label="Vai Trò"
              value={modal.formData.role || 'USER'}
              onChange={(value) => modal.setFormData({ ...modal.formData, role: value })}
              options={ROLE_OPTIONS}
              disabled={!modal.formData.id}
            />
            <FormActions
              onSubmit={handleFormSubmit}
              onCancel={modal.closeFormModal}
              submitText={modal.formData?.id ? 'Cập Nhật' : 'Tạo Mới'}
              isLoading={modal.loading}
            />
          </form>
        </AdminModal>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={modal.isDeleteConfirmOpen}
        title="Delete User"
        message={modal.deleteMessage}
        onConfirm={handleDeleteConfirm}
        onCancel={modal.closeDeleteConfirm}
        isLoading={modal.isLoading}
      />

      {/* Loading Overlay */}
      {modal.isLoading && <LoadingOverlay />}
    </div>
  );
}
