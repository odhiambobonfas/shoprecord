'use client';

import Card from '../ui/Card.ui';
import { useCurrency } from '../../context/CurrencyContext.context';

export default function InventorySummary({ products = [] }) {
  const { formatAmount } = useCurrency();
  const lowStockProducts = products.filter(p => p.quantity < 10);
  const outOfStockProducts = products.filter(p => p.quantity === 0);
  
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);

  const tableStyles = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const thStyles = {
    textAlign: 'left',
    padding: '12px',
    borderBottom: '2px solid #e5e7eb',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
  };

  const tdStyles = {
    padding: '12px',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '14px',
    color: '#6b7280',
  };

  const badgeStyles = (variant) => {
    const variants = {
      danger: { backgroundColor: '#fee2e2', color: '#991b1b' },
      warning: { backgroundColor: '#fef3c7', color: '#92400e' },
    };
    
    return {
      ...variants[variant],
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '500',
    };
  };

  const summaryStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    marginBottom: '24px',
  };

  const summaryItemStyles = {
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
  };

  const summaryLabelStyles = {
    fontSize: '12px',
    color: '#6b7280',
    marginBottom: '4px',
  };

  const summaryValueStyles = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
  };

  const noDataStyles = {
    textAlign: 'center',
    padding: '40px',
    color: '#9ca3af',
  };

  return (
    <Card title="Inventory Summary">
      <div style={summaryStyles}>
        <div style={summaryItemStyles}>
          <div style={summaryLabelStyles}>Total Products</div>
          <div style={summaryValueStyles}>{products.length}</div>
        </div>
        <div style={summaryItemStyles}>
          <div style={summaryLabelStyles}>Total Quantity</div>
          <div style={summaryValueStyles}>{totalQuantity}</div>
        </div>
        <div style={summaryItemStyles}>
          <div style={summaryLabelStyles}>Total Value</div>
          <div style={summaryValueStyles}>{formatAmount(totalValue)}</div>
        </div>
        <div style={summaryItemStyles}>
          <div style={summaryLabelStyles}>Low Stock Items</div>
          <div style={summaryValueStyles}>{lowStockProducts.length}</div>
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <>
          <h4 style={{ fontSize: '14px', marginBottom: '12px', color: '#111827' }}>
            Low Stock Alert
          </h4>
          <table style={tableStyles}>
            <thead>
              <tr>
                <th style={thStyles}>Product</th>
                <th style={thStyles}>Quantity</th>
                <th style={thStyles}>Status</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.map((product) => (
                <tr key={product.id}>
                  <td style={tdStyles}>{product.name}</td>
                  <td style={tdStyles}>{product.quantity}</td>
                  <td style={tdStyles}>
                    <span style={badgeStyles(product.quantity === 0 ? 'danger' : 'warning')}>
                      {product.quantity === 0 ? 'Out of Stock' : 'Low Stock'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {lowStockProducts.length === 0 && products.length > 0 && (
        <div style={noDataStyles}>
          All products are well stocked! 🎉
        </div>
      )}
    </Card>
  );
}
