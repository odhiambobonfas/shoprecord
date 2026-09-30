'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button.ui';
import ConfirmDialog from '../ui/ConfirmDialog.ui';
import { formatDate } from '../../utils/helpers.utils';
import { useCurrency } from '../../context/CurrencyContext.context';

export default function ProductTable({ products, onDelete }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState(null);
  const { formatAmount } = useCurrency();

  const handleEdit = (id) => {
    router.push(`/products/${id}`);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      await onDelete(deleteId);
      setDeleteId(null);
    }
  };

  const tableStyles = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
  };

  const thStyles = {
    textAlign: 'left',
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
  };

  const tdStyles = {
    padding: '16px',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '14px',
    color: '#6b7280',
  };

  const actionButtonsStyles = {
    display: 'flex',
    gap: '8px',
  };

  const noDataStyles = {
    textAlign: 'center',
    padding: '40px',
    color: '#9ca3af',
    backgroundColor: '#fff',
    borderRadius: '8px',
  };

  const stockBadgeStyles = (quantity) => {
    let bgColor, textColor;
    
    if (quantity === 0) {
      bgColor = '#fee2e2';
      textColor = '#991b1b';
    } else if (quantity < 10) {
      bgColor = '#fef3c7';
      textColor = '#92400e';
    } else {
      bgColor = '#d1fae5';
      textColor = '#065f46';
    }
    
    return {
      backgroundColor: bgColor,
      color: textColor,
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '500',
    };
  };

  const expiryBadgeStyles = (daysUntilExpiry) => {
    let bgColor, textColor, icon;
    
    if (daysUntilExpiry < 0) {
      bgColor = '#fee2e2';
      textColor = '#991b1b';
      icon = '⛔';
    } else if (daysUntilExpiry <= 30) {
      bgColor = '#fef3c7';
      textColor = '#92400e';
      icon = '⏰';
    } else {
      bgColor = '#d1fae5';
      textColor = '#065f46';
      icon = '✅';
    }
    
    return {
      backgroundColor: bgColor,
      color: textColor,
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      icon,
    };
  };

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return null;
    
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    return { daysUntilExpiry, date: formatDate(expiryDate) };
  };

  if (!products || products.length === 0) {
    return (
      <div style={noDataStyles}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>📦</div>
        <h3 style={{ fontSize: '16px', marginBottom: '8px', color: '#374151' }}>
          No products found
        </h3>
        <p>Start by adding your first product to the inventory.</p>
      </div>
    );
  }

  const imageStyles = {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
  };

  const noImageStyles = {
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    fontSize: '20px',
  };

  const productCellStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  return (
    <>
      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyles}>
          <thead>
            <tr>
              <th style={thStyles}>Product</th>
              <th style={thStyles}>Category</th>
              <th style={thStyles}>Price</th>
              <th style={thStyles}>Quantity</th>
              <th style={thStyles}>Expiry Status</th>
              <th style={thStyles}>Total Value</th>
              <th style={thStyles}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const expiryStatus = getExpiryStatus(product.expiryDate);
              const expiryStyles = expiryStatus ? expiryBadgeStyles(expiryStatus.daysUntilExpiry) : null;
              
              return (
                <tr key={product.id}>
                  <td style={tdStyles}>
                    <div style={productCellStyles}>
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          style={imageStyles}
                        />
                      ) : (
                        <div style={noImageStyles}>
                          📦
                        </div>
                      )}
                      <div>
                        <strong style={{ color: '#111827' }}>{product.name}</strong>
                        {product.description && (
                          <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
                            {product.description.substring(0, 50)}
                            {product.description.length > 50 && '...'}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={tdStyles}>{product.category || 'N/A'}</td>
                  <td style={tdStyles}>{formatAmount(product.price)}</td>
                  <td style={tdStyles}>
                    <span style={stockBadgeStyles(product.quantity)}>
                      {product.quantity}
                    </span>
                  </td>
                  <td style={tdStyles}>
                    {expiryStatus ? (
                      <div>
                        <span style={expiryStyles}>
                          <span>{expiryStyles.icon}</span>
                          {expiryStatus.daysUntilExpiry < 0 
                            ? 'Expired' 
                            : expiryStatus.daysUntilExpiry === 0 
                            ? 'Today' 
                            : `${expiryStatus.daysUntilExpiry}d`}
                        </span>
                        <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                          {expiryStatus.date}
                        </div>
                      </div>
                    ) : (
                      <span style={{ color: '#9ca3af', fontSize: '12px' }}>No expiry</span>
                    )}
                  </td>
                  <td style={tdStyles}>
                    {formatAmount(product.price * product.quantity)}
                  </td>
                  <td style={tdStyles}>
                    <div style={actionButtonsStyles}>
                      <Button
                        onClick={() => handleEdit(product.id)}
                        variant="outline"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteClick(product.id)}
                        variant="danger"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </>
  );
}
