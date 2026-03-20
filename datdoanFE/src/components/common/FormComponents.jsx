import React, { useState } from 'react';

/**
 * Input Field Component - Reusable form input
 */
export const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  error = null,
  disabled = false,
  className = '',
}) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value || ''}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-4 py-2 border border-gray-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
          transition
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
      />
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
};

/**
 * Textarea Component
 */
export const FormTextarea = ({
  label,
  name,
  value,
  onChange,
  placeholder = '',
  required = false,
  error = null,
  disabled = false,
  rows = 4,
}) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <textarea
        name={name}
        value={value || ''}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={`
          w-full px-4 py-2 border border-gray-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
          transition resize-none
          ${error ? 'border-red-500' : ''}
        `}
      />
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
};

/**
 * Select Component
 */
export const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Chọn...',
  required = false,
  error = null,
  disabled = false,
}) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <select
        name={name}
        value={value || ''}
        onChange={handleChange}
        disabled={disabled}
        className={`
          w-full px-4 py-2 border border-gray-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
          transition
          ${error ? 'border-red-500' : ''}
        `}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
};

/**
 * Checkbox Component
 */
export const FormCheckbox = ({
  label,
  name,
  checked,
  onChange,
  disabled = false,
  error = null,
}) => {
  return (
    <div className="flex items-center gap-3">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
      />
      {label && (
        <label className="text-sm font-medium text-gray-700 cursor-pointer">
          {label}
        </label>
      )}
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
};

/**
 * Form Submit Actions - Buttons
 */
export const FormActions = ({
  onSubmit,
  onCancel,
  submitText = 'Lưu',
  cancelText = 'Hủy',
  isLoading = false,
  isDisabled = false,
  submitButtonVariant = 'primary', // 'primary' | 'danger'
}) => {
  const submitButtonClass =
    submitButtonVariant === 'danger'
      ? 'bg-red-600 hover:bg-red-700'
      : 'bg-blue-600 hover:bg-blue-700';

  return (
    <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
      <button
        type="button"
        onClick={onCancel}
        disabled={isLoading || isDisabled}
        className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
      >
        {cancelText}
      </button>
      <button
        type="button"
        onClick={onSubmit}
        disabled={isLoading || isDisabled}
        className={`px-4 py-2 text-white rounded-lg transition disabled:opacity-50 ${submitButtonClass}`}
      >
        {isLoading ? 'Đang xử lý...' : submitText}
      </button>
    </div>
  );
};

/**
 * Alert Message Component
 */
export const FormAlert = ({ type = 'info', message, onClose }) => {
  const typeClasses = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  };

  return (
    <div className={`p-4 rounded-lg border ${typeClasses[type]} flex justify-between items-start`}>
      <p className="text-sm font-medium">{message}</p>
      {onClose && (
        <button onClick={onClose} className="ml-4 text-lg font-bold opacity-70 hover:opacity-100">
          ×
        </button>
      )}
    </div>
  );
};
