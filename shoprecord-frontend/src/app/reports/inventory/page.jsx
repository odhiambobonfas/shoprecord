'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout.component';
import Card from '../../../components/ui/Card.ui';
import Loading from '../../../components/ui/Loading.ui';
import productService from '../../../services/productService.service';
import { useCurrency } from '../../../hooks/useCurrency.hook';

export default function InventoryReportPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { formatCurrency } = useCurrency();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalProducts = products.length;
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const lowStockItems = products.filter(p => p.quantity < 10).length;
  const outOfStock = products.filter(p => p.quantity === 0).length;
  const inStock = products.filter(p => p.quantity > 0).length;

  const headerStyles = {
    marginBottom: '24px',
  };

  const titleStyles = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '8px',
  };

  const subtitleStyles = {
    fontSize: '13px',
    color: '#6b7280',
  };

  const statsGridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '24px',
  };

  const statCardStyles = (color) => ({
    padding: '20px',
    background: `linear-gradient(135deg, ${color}10 0%, ${color}05 100%)`,
    borderRadius: '12px',
    border: `1px solid ${color}30`,
  });

  const statIconStyles = {
    fontSize: '32px',
    marginBottom: '12px',
  };

  const statLabelStyles = {
    fontSize: '13px',
    color: '#6b7280',
    marginBottom: '8px',
  };

  const statValueStyles = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
  };

  const categoryGridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  };

  const tableStyles = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const thStyles = {
    textAlign: 'left',
    padding: '12px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#6b7280',
    borderBottom: '2px solid #e5e7eb',
  };

  const tdStyles = {
    padding: '12px',
    fontSize: '13px',
    color: '#374151',
    borderBottom: '1px solid #f3f4f6',
  };

  const getCategoryStats = () => {
    const categories = {};
    products.forEach(product => {
      const category = product.category || 'Uncategorized';
      if (!categories[category]) {
        categories[category] = { count: 0, value: 0, quantity: 0 };
      }
      categories[category].count++;
      categories[category].value += product.price * product.quantity;
      categories[category].quantity += product.quantity;
    });
    return Object.entries(categories).map(([name, stats]) => ({ name, ...stats }));
  };

  const categoryStats = getCategoryStats();

  if (loading) {
    return (
      <DashboardLayout>
        <Loading message="Loading inventory report..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={headerStyles}>
        <h1 style={titleStyles}>📋 Inventory Report</h1>
        <p style={subtitleStyles}>Overview of your inventory status</p>
      </div>

      <div style={statsGridStyles}>
        <div style={statCardStyles('#3b82f6')}>
          <div style={statIconStyles}>📦</div>
          <div style={statLabelStyles}>Total Products</div>
          <div style={statValueStyles}>{totalProducts}</div>
        </div>
        <div style={statCardStyles('#10b981')}>
          <div style={statIconStyles}>✅</div>
          <div style={statLabelStyles}>In Stock</div>
          <div style={statValueStyles}>{inStock}</div>
        </div>
        <div style={statCardStyles('#f59e0b')}>
          <div style={statIconStyles}>⚠️</div>
          <div style={statLabelStyles}>Low Stock</div>
          <div style={statValueStyles}>{lowStockItems}</div>
        </div>
        <div style={statCardStyles('#ef4444')}>
          <div style={statIconStyles}>❌</div>
          <div style={statLabelStyles}>Out of Stock</div>
          <div style={statValueStyles}>{outOfStock}</div>
        </div>
        <div style={statCardStyles('#8b5cf6')}>
          <div style={statIconStyles}>📊</div>
          <div style={statLabelStyles}>Total Quantity</div>
          <div style={statValueStyles}>{totalQuantity}</div>
        </div>
        <div style={statCardStyles('#06b6d4')}>
          <div style={statIconStyles}>💰</div>
          <div style={statLabelStyles}>Total Value</div>
          <div style={statValueStyles}>{formatCurrency(totalValue)}</div>
        </div>
      </div>

      <div style={categoryGridStyles}>
        <Card>
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Category Breakdown</h2>
          <table style={tableStyles}>
            <thead>
              <tr>
                <th style={thStyles}>Category</th>
                <th style={thStyles}>Products</th>
                <th style={thStyles}>Quantity</th>
                <th style={thStyles}>Value</th>
              </tr>
            </thead>
            <tbody>
              {categoryStats.map((cat, index) => (
                <tr key={index}>
                  <td style={tdStyles}>{cat.name}</td>
                  <td style={tdStyles}>{cat.count}</td>
                  <td style={tdStyles}>{cat.quantity}</td>
                  <td style={tdStyles}>{formatCurrency(cat.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card>
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: '#ef4444' }}>
            ⚠️ Low Stock Alert
          </h2>
          <table style={tableStyles}>
            <thead>
              <tr>
                <th style={thStyles}>Product</th>
                <th style={thStyles}>Quantity</th>
                <th style={thStyles}>Status</th>
              </tr>
            </thead>
            <tbody>
              {products
                .filter(p => p.quantity < 10)
                .sort((a, b) => a.quantity - b.quantity)
                .slice(0, 10)
                .map((product) => (
                  <tr key={product._id}>
                    <td style={tdStyles}>{product.name}</td>
                    <td style={tdStyles}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: product.quantity === 0 ? '#fee2e2' : '#fef3c7',
                        color: product.quantity === 0 ? '#991b1b' : '#92400e',
                      }}>
                        {product.quantity}
                      </span>
                    </td>
                    <td style={tdStyles}>
                      {product.quantity === 0 ? '🔴 Out of Stock' : '🟡 Low Stock'}
                    </td>
                  </tr>
                ))}
              {products.filter(p => p.quantity < 10).length === 0 && (
                <tr>
                  <td colSpan="3" style={{ ...tdStyles, textAlign: 'center', padding: '40px', color: '#10b981' }}>
                    ✅ All products are well stocked!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </DashboardLayout>
  );
}
