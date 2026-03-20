import React, { useEffect, useState } from 'react';
import { Edit2, Trash2, ShoppingCart, TrendingUp, Search, Filter } from 'lucide-react';
import { useAdminModal } from '../../hooks/useAdminModal';
import { AdminModal, ConfirmModal, LoadingOverlay } from '../../components/common/AdminModal';
import { FormSelect, FormActions, FormAlert } from '../../components/common/FormComponents';
import adminOrderApi from '../../api/adminOrderApi';

const ORDER_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Chờ xử lý' },
  { value: 'PREPARING', label: 'Đang chuẩn bị' },
  { value: 'SHIPPING', label: 'Đang giao' },
  { value: 'COMPLETED', label: 'Hoàn thành' },
  { value: 'CANCELLED', label: 'Đã hủy' },
];

const formatVND = (value) => {
  if (value == null || value === '') return '-';
  try {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value));
  } catch (_) {
    return String(value);
  }
};

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const modal = useAdminModal();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await adminOrderApi.getAll();
      let data = res && res.data ? res.data : res;

      let rawOrders = [];
      if (Array.isArray(data)) {
        rawOrders = data;
      } else if (data && Array.isArray(data.items)) {
        rawOrders = data.items;
      } else if (data && Array.isArray(data.content)) {
        rawOrders = data.content;
      } else if (data && typeof data === 'object') {
        rawOrders = [data];
      }

      const sanitizeOrder = (o) => {
        if (!o) return null;
        const user = o.user
          ? { id: o.user.id, username: o.user.username, fullName: o.user.fullName }
          : undefined;
        const items = Array.isArray(o.items)
          ? o.items.map((it) => ({
              id: it.id,
              quantity: it.quantity ?? it.qty ?? 1,
              price: it.price ?? it.unitPrice ?? null,
              product: it.product
                ? { id: it.product.id, name: it.product.name }
                : it.productId
                ? { id: it.productId }
                : undefined,
            }))
          : [];
        return {
          id: o.id,
          customerName: o.customerName || o.fullName || (user && user.fullName) || '',
          phone: o.phone || (user && user.phone) || '',
          shippingAddress: o.shippingAddress || o.address || '',
          totalPrice: o.totalPrice ?? o.total ?? null,
          status: o.status || o.orderStatus || 'PENDING',
          paymentMethod: o.paymentMethod || o.payment || '',
          user,
          items,
          itemsCount: items.length,
        };
      };

      const sanitized = rawOrders.map(sanitizeOrder).filter(Boolean);
      setOrders(sanitized);
    } catch (err) {
      modal.showAlert(`Error loading orders: ${err.response?.data?.message || err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenStatusModal = (order) => {
    modal.openEditForm({
      id: order.id,
      status: order.status,
      customerName: order.customerName,
    });
  };

  const handleOpenDeleteConfirm = (order) => {
    modal.openDeleteConfirm(`Delete order #${order.id} from "${order.customerName}"?`);
    modal.setDeleteData({ orderId: order.id });
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();

    try {
      modal.setLoading(true);
      await adminOrderApi.updateStatus(modal.formData.id, modal.formData.status);
      modal.showAlert('Order status updated successfully', 'success');
      modal.closeFormModal();
      fetchOrders();
    } catch (err) {
      modal.showAlert(`Error: ${err.response?.data?.message || err.message}`, 'error');
    } finally {
      modal.setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      modal.setLoading(true);
      await adminOrderApi.delete(modal.deleteData.orderId);
      modal.showAlert('Order deleted successfully', 'success');
      modal.closeDeleteConfirm();
      fetchOrders();
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
        <h2 className="text-3xl font-bold text-gray-900">Quản Lý Đơn Hàng</h2>
        <p className="text-gray-600 mt-1">{orders.length} đơn hàng trong hệ thống</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white shadow-md">
              <ShoppingCart size={24} />
            </div>
            <span className="text-sm font-semibold text-green-600">↑ 12%</span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Tổng đơn hàng</h3>
          <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white shadow-md">
              <TrendingUp size={24} />
            </div>
            <span className="text-sm font-semibold text-green-600">↑ 8%</span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Tổng doanh thu</h3>
          <p className="text-2xl font-bold text-gray-900">
            {formatVND(orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0))}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white shadow-md">
              <Filter size={24} />
            </div>
            <span className="text-sm font-semibold text-orange-600">Chờ xử lý</span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Chưa giao</h3>
          <p className="text-2xl font-bold text-gray-900">
            {orders.filter(o => o.status === 'PENDING' || o.status === 'PROCESSING').length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white shadow-md">
              <Edit2 size={24} />
            </div>
            <span className="text-sm font-semibold text-red-600">Yêu cầu</span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Đã giao</h3>
          <p className="text-2xl font-bold text-gray-900">
            {orders.filter(o => o.status === 'DELIVERED').length}
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

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <ShoppingCart className="text-gray-300 mx-auto mb-4" size={48} />
            <p>Đang tải đơn hàng...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <ShoppingCart className="text-gray-300 mx-auto mb-4" size={48} />
            <p className="text-lg">Không có đơn hàng nào</p>
            <p className="text-sm mt-2">Bắt đầu nhận đơn hàng từ khách hàng</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Mã Đơn</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Khách Hàng</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Điện Thoại</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Số Mặt Hàng</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tổng Tiền</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Trạng Thái</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Thanh Toán</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order, index) => (
                  <tr key={order.id} className="admin-table-row hover:bg-gray-50 transition-colors" style={{ '--index': index }}>
                    <td className="px-6 py-4 text-sm font-bold text-orange-600">#{order.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{order.customerName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-semibold">{order.itemsCount}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-bold text-orange-600">{formatVND(order.totalPrice)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                        order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        order.status === 'SHIPPING' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'PREPARING' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status === 'COMPLETED' ? 'Hoàn thành' :
                         order.status === 'SHIPPING' ? 'Đang giao' :
                         order.status === 'PREPARING' ? 'Đang chuẩn bị' :
                         order.status === 'CANCELLED' ? 'Đã hủy' :
                         'Chờ xử lý'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.paymentMethod || 'COD'}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleOpenStatusModal(order)}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                          title="Thay đổi trạng thái"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteConfirm(order)}
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

      {/* Change Status Modal */}
      {modal.formData && (
        <AdminModal
          isOpen={modal.isFormModalOpen}
          onClose={modal.closeFormModal}
          title="Thay Đổi Trạng Thái Đơn Hàng"
        >
          <form onSubmit={handleStatusSubmit} className="space-y-4">
            <div className="bg-gray-50 p-3 rounded border border-gray-200 mb-4">
              <p className="text-sm font-medium text-gray-700">Mã đơn #{modal.formData?.id}</p>
              <p className="text-sm text-gray-600">{modal.formData?.customerName}</p>
            </div>
            <FormSelect
              label="Trạng Thái Mới"
              value={modal.formData.status || 'PENDING'}
              onChange={(value) => modal.setFormData({ ...modal.formData, status: value })}
              options={ORDER_STATUS_OPTIONS}
            />
            <FormActions
              onSubmit={handleStatusSubmit}
              onCancel={modal.closeFormModal}
              submitText="Cập Nhật Trạng Thái"
              isLoading={modal.loading}
            />
          </form>
        </AdminModal>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={modal.isDeleteConfirmOpen}
        title="Xác Nhận Xóa"
        message={modal.deleteMessage}
        onConfirm={handleDeleteConfirm}
        onCancel={modal.closeDeleteConfirm}
        isLoading={modal.loading}
      />

      {/* Loading Overlay */}
      {modal.loading && <LoadingOverlay />}
    </div>
  );
}
