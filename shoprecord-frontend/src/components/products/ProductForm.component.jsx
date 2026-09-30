'use client';

import { useState, useEffect } from 'react';
import Input from '../ui/Input.ui';
import Button from '../ui/Button.ui';
import Alert from '../ui/Alert.ui';
import { PRODUCT_CATEGORIES } from '../../utils/constants.utils';

export default function ProductForm({ initialData, onSubmit, submitLabel = 'Submit' }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    quantity: '',
    sku: '',
    barcode: '',
    minStockLevel: '5',
    expiryDate: '',
    manufacturingDate: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        category: initialData.category || '',
        price: initialData.price?.toString() || '',
        quantity: initialData.quantity?.toString() || '',
        sku: initialData.sku || '',
        barcode: initialData.barcode || '',
        minStockLevel: initialData.minStockLevel?.toString() || '5',
        expiryDate: initialData.expiryDate ? new Date(initialData.expiryDate).toISOString().split('T')[0] : '',
        manufacturingDate: initialData.manufacturingDate ? new Date(initialData.manufacturingDate).toISOString().split('T')[0] : '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Real-time validation
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true,
    });
    validateField(name, formData[name]);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, image: 'Please select a valid image file' });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: 'Image size should be less than 5MB' });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setErrors({ ...errors, image: '' });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Product name is required';
        } else if (value.length < 3) {
          error = 'Product name must be at least 3 characters';
        }
        break;
      case 'price':
        if (!value || parseFloat(value) <= 0) {
          error = 'Price must be greater than 0';
        }
        break;
      case 'quantity':
        if (!value || parseInt(value) < 0) {
          error = 'Quantity must be 0 or greater';
        }
        break;
      case 'sku':
        if (value && value.length < 3) {
          error = 'SKU must be at least 3 characters';
        }
        break;
    }

    setErrors({ ...errors, [name]: error });
    return !error;
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Product name must be at least 3 characters';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      newErrors.quantity = 'Quantity must be 0 or greater';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (formData.sku && formData.sku.length < 3) {
      newErrors.sku = 'SKU must be at least 3 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        sku: formData.sku?.trim() || undefined,
        barcode: formData.barcode?.trim() || undefined,
        minStockLevel: parseInt(formData.minStockLevel) || 5,
        expiryDate: formData.expiryDate || undefined,
        manufacturingDate: formData.manufacturingDate || undefined,
        image: imagePreview || undefined,
      };

      await onSubmit(productData);
      setSuccessMessage('Product saved successfully!');
      
      if (!initialData) {
        // Reset form if creating new product
        setFormData({
          name: '',
          description: '',
          category: '',
          price: '',
          quantity: '',
          sku: '',
          barcode: '',
          minStockLevel: '5',
        });
        setImagePreview(null);
        setTouched({});
      }
    } catch (error) {
      setErrorMessage(error.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const selectStyles = {
    width: '100%',
    padding: '12px 14px',
    fontSize: '14px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    outline: 'none',
    marginBottom: '16px',
    backgroundColor: '#fff',
    transition: 'all 0.2s ease',
  };

  const labelStyles = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
  };

  const sectionHeaderStyles = {
    fontSize: '16px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '16px',
    marginTop: '32px',
    paddingBottom: '8px',
    borderBottom: '2px solid #e5e7eb',
  };

  const imageUploadContainerStyles = {
    marginBottom: '24px',
    padding: '20px',
    border: '2px dashed #d1d5db',
    borderRadius: '12px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: '#f9fafb',
  };

  const imagePreviewStyles = {
    maxWidth: '200px',
    maxHeight: '200px',
    margin: '0 auto',
    borderRadius: '8px',
    objectFit: 'cover',
  };

  const stockAlertStyles = {
    padding: '12px 16px',
    borderRadius: '8px',
    backgroundColor: '#fef3c7',
    border: '1px solid #fbbf24',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '16px',
  };

  const lowStockAlertStyles = {
    padding: '12px 16px',
    borderRadius: '8px',
    backgroundColor: '#fee2e2',
    border: '1px solid #ef4444',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '16px',
  };

  const isLowStock = formData.quantity && formData.minStockLevel && 
    parseInt(formData.quantity) <= parseInt(formData.minStockLevel);
  
  const isOutOfStock = formData.quantity && parseInt(formData.quantity) === 0;

  return (
    <form onSubmit={handleSubmit}>
      {successMessage && (
        <Alert
          type="success"
          message={successMessage}
          onClose={() => setSuccessMessage('')}
        />
      )}
      
      {errorMessage && (
        <Alert
          type="error"
          message={errorMessage}
          onClose={() => setErrorMessage('')}
        />
      )}

      {/* Product Image */}
      <div style={sectionHeaderStyles}>Product Image</div>
      <div
        style={imageUploadContainerStyles}
        onMouseOver={(e) => {
          e.currentTarget.style.borderColor = '#3b82f6';
          e.currentTarget.style.backgroundColor = '#eff6ff';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.borderColor = '#d1d5db';
          e.currentTarget.style.backgroundColor = '#f9fafb';
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
          id="image-upload"
        />
        <label htmlFor="image-upload" style={{ cursor: 'pointer', display: 'block' }}>
          {imagePreview ? (
            <div>
              <img src={imagePreview} alt="Preview" style={imagePreviewStyles} />
              <p style={{ marginTop: '12px', fontSize: '14px', color: '#6b7280' }}>
                Click to change image
              </p>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '48px', color: '#9ca3af', marginBottom: '8px' }}>📷</div>
              <p style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
                Click to upload product image
              </p>
              <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          )}
        </label>
        {errors.image && (
          <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px' }}>{errors.image}</p>
        )}
      </div>

      {/* Basic Information */}
      <div style={sectionHeaderStyles}>Basic Information</div>
      <Input
        label="Product Name"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Enter product name"
        error={errors.name}
        required
      />

      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="description" style={labelStyles}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter detailed product description"
          rows={4}
          style={{
            ...selectStyles,
            resize: 'vertical',
            fontFamily: 'inherit',
          }}
        />
        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
          {formData.description.length}/500 characters
        </p>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="category" style={labelStyles}>
          Category <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          onBlur={handleBlur}
          style={{
            ...selectStyles,
            borderColor: errors.category ? '#ef4444' : '#d1d5db',
          }}
        >
          <option value="">Select a category</option>
          {PRODUCT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && (
          <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.category}</p>
        )}
      </div>

      {/* Pricing & Inventory */}
      <div style={sectionHeaderStyles}>Pricing & Inventory</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <Input
            label="Price"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="0.00"
            error={errors.price}
            required
            step="0.01"
            min="0"
          />
          {formData.price && (
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
              ₹{parseFloat(formData.price).toFixed(2)}
            </p>
          )}
        </div>

        <Input
          label="Quantity in Stock"
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="0"
          error={errors.quantity}
          required
          min="0"
        />
      </div>

      <div style={{ marginTop: '16px' }}>
        <Input
          label="Minimum Stock Alert Level"
          type="number"
          name="minStockLevel"
          value={formData.minStockLevel}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="5"
          min="0"
        />
        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
          Get alerted when stock falls below this level
        </p>
      </div>

      {/* Stock Alerts */}
      {isOutOfStock && (
        <div style={lowStockAlertStyles}>
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <div>
            <p style={{ fontWeight: '600', color: '#991b1b', fontSize: '14px' }}>Out of Stock!</p>
            <p style={{ fontSize: '12px', color: '#7f1d1d' }}>This product is currently unavailable</p>
          </div>
        </div>
      )}

      {isLowStock && !isOutOfStock && (
        <div style={stockAlertStyles}>
          <span style={{ fontSize: '20px' }}>⚡</span>
          <div>
            <p style={{ fontWeight: '600', color: '#92400e', fontSize: '14px' }}>Low Stock Alert</p>
            <p style={{ fontSize: '12px', color: '#78350f' }}>
              Stock is below minimum level ({formData.minStockLevel} units)
            </p>
          </div>
        </div>
      )}

      {/* Product Identifiers */}
      <div style={sectionHeaderStyles}>Product Identifiers (Optional)</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <Input
            label="SKU"
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g., PROD-001"
            error={errors.sku}
          />
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
            Stock Keeping Unit
          </p>
        </div>

        <div>
          <Input
            label="Barcode"
            type="text"
            name="barcode"
            value={formData.barcode}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g., 123456789012"
          />
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
            Product barcode number
          </p>
        </div>
      </div>

      {/* Date Tracking */}
      <div style={sectionHeaderStyles}>📅 Date Tracking (Optional)</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <Input
            label="Manufacturing Date"
            type="date"
            name="manufacturingDate"
            value={formData.manufacturingDate}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Select date"
          />
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
            Date product was manufactured
          </p>
        </div>

        <div>
          <Input
            label="Expiry Date"
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Select date"
          />
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
            Product expiration date
          </p>
        </div>
      </div>

      {/* Expiry Alert */}
      {formData.expiryDate && (() => {
        const today = new Date();
        const expiry = new Date(formData.expiryDate);
        const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        const isExpired = daysUntilExpiry < 0;
        const isExpiringSoon = daysUntilExpiry >= 0 && daysUntilExpiry <= 30;

        if (isExpired) {
          return (
            <div style={{
              ...lowStockAlertStyles,
              backgroundColor: '#fee2e2',
              borderColor: '#ef4444',
            }}>
              <span style={{ fontSize: '20px' }}>⛔</span>
              <div>
                <p style={{ fontWeight: '600', color: '#991b1b', fontSize: '14px' }}>
                  Product Expired!
                </p>
                <p style={{ fontSize: '12px', color: '#7f1d1d' }}>
                  This product expired {Math.abs(daysUntilExpiry)} day(s) ago
                </p>
              </div>
            </div>
          );
        }

        if (isExpiringSoon) {
          return (
            <div style={{
              ...stockAlertStyles,
              backgroundColor: '#fef3c7',
              borderColor: '#fbbf24',
            }}>
              <span style={{ fontSize: '20px' }}>⏰</span>
              <div>
                <p style={{ fontWeight: '600', color: '#92400e', fontSize: '14px' }}>
                  Expiring Soon!
                </p>
                <p style={{ fontSize: '12px', color: '#78350f' }}>
                  This product will expire in {daysUntilExpiry} day(s)
                </p>
              </div>
            </div>
          );
        }

        return null;
      })()}

      <div style={{ marginTop: '32px', display: 'flex', gap: '12px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
        <Button type="submit" disabled={loading} fullWidth>
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span style={{ 
                display: 'inline-block',
                width: '16px',
                height: '16px',
                border: '2px solid #fff',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}>
              </span>
              Saving...
            </span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {initialData ? '💾' : '✨'} {submitLabel}
            </span>
          )}
        </Button>
      </div>
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </form>
  );
}
