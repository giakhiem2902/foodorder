import { useState } from 'react';

/**
 * Hook để quản lý modal state cho admin CRUD operations
 * Hỗ trợ: Add, Edit, Delete, View
 */
export const useAdminModal = () => {
  // Form modal state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formData, setFormData] = useState(null);

  // Delete confirmation modal state
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [deleteData, setDeleteData] = useState(null);

  // Detail modal state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);

  // Loading and alert states
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // === Form Modal Methods ===
  const openAddForm = (initialData = {}) => {
    setFormData(initialData);
    setIsFormModalOpen(true);
  };

  const openEditForm = (data) => {
    setFormData(data);
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setFormData(null);
  };

  // === Delete Confirmation Modal Methods ===
  const openDeleteConfirm = (message) => {
    setDeleteMessage(message);
    setIsDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
    setDeleteMessage('');
    setDeleteData(null);
  };

  // === Detail View Modal Methods ===
  const openDetailModal = (data) => {
    setDetailData(data);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setDetailData(null);
  };

  // === Alert Methods ===
  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
  };

  const clearAlert = () => {
    setAlert(null);
  };

  return {
    // Form modal
    isFormModalOpen,
    formData,
    setFormData,
    openAddForm,
    openEditForm,
    closeFormModal,

    // Delete modal
    isDeleteConfirmOpen,
    deleteMessage,
    deleteData,
    setDeleteData,
    openDeleteConfirm,
    closeDeleteConfirm,

    // Detail modal
    isDetailModalOpen,
    detailData,
    setDetailData,
    openDetailModal,
    closeDetailModal,

    // Loading and alert
    loading,
    setLoading,
    alert,
    setAlert,
    showAlert,
    clearAlert,
  };
};
