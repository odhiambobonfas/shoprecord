'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout.component';
import StatsCard from '../../components/dashboard/StatsCard.component';
import InventorySummary from '../../components/dashboard/InventorySummary.component';
import Loading from '../../components/ui/Loading.ui';
import Alert from '../../components/ui/Alert.ui';
import Card from '../../components/ui/Card.ui';
import Button from '../../components/ui/Button.ui';
import productService from '../../services/productService.service';
import { formatDate } from '../../utils/helpers.utils';
import { useCurrency } from '../../context/CurrencyContext.context';

export default function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const router = useRouter();
  const { formatAmount } = useCurrency();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setError('');
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data?.products || data || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      setError('Failed to load products. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  // ⚡ Optimized stats calculation
  const stats = useMemo(() => {
    const totalProducts = products.length;

    const totalQuantity = products.reduce(
      (sum, p) => sum + (Number(p.quantity) || 0),
      0
    );

    const totalValue = products.reduce(
      (sum, p) => sum + (Number(p.price) || 0) * (Number(p.quantity) || 0),
      0
    );

    const lowStock = products.filter(
      p => p.quantity > 0 && p.quantity < 10
    ).length;

    const outOfStock = products.filter(p => p.quantity === 0).length;

    // Calculate average product price
    const avgPrice = totalProducts > 0 ? totalValue / totalQuantity : 0;

    // Get category breakdown
    const categoryBreakdown = products.reduce((acc, p) => {
      const cat = p.category || 'Uncategorized';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    // Get recent products (last 5)
    const recentProducts = [...products]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    return {
      totalProducts,
      totalQuantity,
      totalValue,
      lowStock,
      outOfStock,
      avgPrice,
      categoryBreakdown,
      recentProducts,
    };
  }, [products]);

  if (loading) {
    return (
      <DashboardLayout>
        <Loading message="Loading dashboard..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.subtitle}>
            Real-time overview of your shop inventory
            {lastUpdated && (
              <span style={styles.lastUpdated}>
                {' • '}Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>

        <div style={styles.headerActions}>
          <button onClick={fetchProducts} style={styles.refreshBtn} disabled={loading}>
            {loading ? '⌛' : '🔄'} Refresh
          </button>
          <Button onClick={() => router.push('/products/new')}>
            + Add Product
          </Button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
        />
      )}

      {/* EMPTY STATE */}
      {!error && products.length === 0 && !loading && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📦</div>
          <h3 style={styles.emptyTitle}>No products in inventory</h3>
          <p style={styles.emptyText}>Start by adding your first product to track your inventory.</p>
          <Button onClick={() => router.push('/products/new')}>
            + Add Your First Product
          </Button>
        </div>
      )}

      {/* STATS GRID */}
      {products.length > 0 && (
        <>
          <div style={styles.statsGrid}>
            <StatsCard
              title="Total Products"
              value={stats.totalProducts}
              icon="📦"
              color="#2563eb"
            />
            <StatsCard
              title="Total Quantity"
              value={stats.totalQuantity.toLocaleString()}
              icon="📊"
              color="#16a34a"
            />
            <StatsCard
              title="Inventory Value"
              value={formatAmount(stats.totalValue)}
              icon="💰"
              color="#f59e0b"
            />
            <StatsCard
              title="Low Stock Items"
              value={stats.lowStock}
              icon="⚠️"
              color="#dc2626"
            />
            <StatsCard
              title="Out of Stock"
              value={stats.outOfStock}
              icon="❌"
              color="#7c2d12"
            />
            <StatsCard
              title="Average Price"
              value={formatAmount(stats.avgPrice)}
              icon="💵"
              color="#8b5cf6"
            />
          </div>

          {/* TWO COLUMN LAYOUT */}
          <div style={styles.twoColumnGrid}>
            {/* RECENT ACTIVITY */}
            <Card title="Recent Products">
              {stats.recentProducts.length > 0 ? (
                <div style={styles.recentList}>
                  {stats.recentProducts.map((product) => (
                    <div key={product.id} style={styles.recentItem}>
                      <div>
                        <div style={styles.recentName}>{product.name}</div>
                        <div style={styles.recentMeta}>
                          Added {formatDate(product.createdAt)}
                        </div>
                      </div>
                      <div style={styles.recentPrice}>
                        {formatAmount(product.price)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={styles.noData}>No recent products</div>
              )}
            </Card>

            {/* CATEGORY BREAKDOWN */}
            <Card title="Category Distribution">
              {Object.keys(stats.categoryBreakdown).length > 0 ? (
                <div style={styles.categoryList}>
                  {Object.entries(stats.categoryBreakdown)
                    .sort((a, b) => b[1] - a[1])
                    .map(([category, count]) => (
                      <div key={category} style={styles.categoryItem}>
                        <div style={styles.categoryInfo}>
                          <div style={styles.categoryName}>{category}</div>
                          <div style={styles.categoryCount}>{count} items</div>
                        </div>
                        <div style={styles.categoryBar}>
                          <div
                            style={{
                              ...styles.categoryProgress,
                              width: `${(count / stats.totalProducts) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div style={styles.noData}>No categories</div>
              )}
            </Card>
          </div>

          {/* INVENTORY TABLE */}
          <InventorySummary products={products} />
        </>
      )}
    </DashboardLayout>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '6px',
  },
  subtitle: {
    fontSize: '13px',
    color: '#6b7280',
    display: 'flex',
    alignItems: 'center',
  },
  lastUpdated: {
    fontSize: '11px',
    color: '#9ca3af',
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  refreshBtn: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    backgroundColor: '#fff',
    color: '#374151',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px',
    transition: 'all 0.2s',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  twoColumnGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  emptyState: {
    padding: '60px 40px',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '16px',
    color: '#fff',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '12px',
  },
  emptyText: {
    fontSize: '14px',
    marginBottom: '24px',
    opacity: 0.9,
  },
  recentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  recentItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    transition: 'all 0.2s',
    cursor: 'pointer',
  },
  recentName: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '4px',
  },
  recentMeta: {
    fontSize: '11px',
    color: '#6b7280',
  },
  recentPrice: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#2563eb',
  },
  categoryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  categoryItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  categoryInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827',
  },
  categoryCount: {
    fontSize: '12px',
    color: '#6b7280',
  },
  categoryBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  categoryProgress: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  noData: {
    textAlign: 'center',
    padding: '32px',
    color: '#9ca3af',
    fontSize: '14px',
  },
};
