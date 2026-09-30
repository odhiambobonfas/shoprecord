'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout.component';
import Card from '../../components/ui/Card.ui';
import Button from '../../components/ui/Button.ui';
import Loading from '../../components/ui/Loading.ui';
import Alert from '../../components/ui/Alert.ui';
import saleService from '../../services/saleService.service';

export default function SalesPage() {
  const router = useRouter();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [period, setPeriod] = useState('today');

  useEffect(() => {
    fetchSales();
    fetchAnalytics();
  }, [period]);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await saleService.getSales({ limit: 50 });
      setSales(response.data || []);
    } catch (error) {
      setError('Failed to load sales');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const data = await saleService.getSalesAnalytics(period);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const containerStyles = {
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  };

  const titleStyles = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const statsGridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  };

  const statCardStyles = {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
  };

  const periodSelectorStyles = {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
  };

  if (loading) return <DashboardLayout><Loading /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div style={containerStyles}>
        <div style={headerStyles}>
          <h1 style={titleStyles}>
            <span style={{ fontSize: '32px' }}>📊</span>
            Sales History
          </h1>
          <Button onClick={() => router.push('/sales/new')}>
            + New Sale
          </Button>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {/* Period Selector */}
        <div style={periodSelectorStyles}>
          {['today', 'week', 'month', 'year'].map(p => (
            <Button
              key={p}
              onClick={() => setPeriod(p)}
              variant={period === p ? 'primary' : 'outline'}
              style={{ textTransform: 'capitalize' }}
            >
              {p}
            </Button>
          ))}
        </div>

        {/* Analytics Summary */}
        {analytics && (
          <div style={statsGridStyles}>
            <div style={statCardStyles}>
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px', fontWeight: '600' }}>
                TOTAL SALES
              </div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#111827' }}>
                {analytics.totalSales}
              </div>
            </div>

            <div style={statCardStyles}>
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px', fontWeight: '600' }}>
                REVENUE
              </div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#16a34a' }}>
                ₹{analytics.totalRevenue.toFixed(2)}
              </div>
            </div>

            <div style={statCardStyles}>
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px', fontWeight: '600' }}>
                PROFIT
              </div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#2563eb' }}>
                ₹{analytics.totalProfit.toFixed(2)}
              </div>
            </div>

            <div style={statCardStyles}>
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px', fontWeight: '600' }}>
                AVG. SALE VALUE
              </div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#7c3aed' }}>
                ₹{analytics.averageSaleValue.toFixed(2)}
              </div>
            </div>
          </div>
        )}

        {/* Sales Table */}
        <Card>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            Recent Transactions
          </h2>

          {sales.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
              <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>No sales yet</p>
              <p style={{ fontSize: '14px', marginBottom: '24px' }}>Start by creating your first sale</p>
              <Button onClick={() => router.push('/sales/new')}>
                Create First Sale
              </Button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>
                      INVOICE
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>
                      DATE
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>
                      CUSTOMER
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>
                      ITEMS
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>
                      AMOUNT
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>
                      PROFIT
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>
                      PAYMENT
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>
                      STATUS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map(sale => (
                    <tr
                      key={sale._id}
                      style={{ borderBottom: '1px solid #f3f4f6', cursor: 'pointer' }}
                      onClick={() => router.push(`/sales/${sale._id}`)}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                    >
                      <td style={{ padding: '12px', fontWeight: '600', color: '#3b82f6' }}>
                        {sale.invoiceNumber}
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#6b7280' }}>
                        {formatDate(sale.saleDate)}
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px' }}>
                        {sale.customer?.name || 'Walk-in'}
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px' }}>
                        {sale.items.length} items
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px', fontWeight: '600', color: '#16a34a' }}>
                        ₹{sale.totalAmount.toFixed(2)}
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px', fontWeight: '600', color: '#2563eb' }}>
                        ₹{sale.totalProfit.toFixed(2)}
                      </td>
                      <td style={{ padding: '12px', fontSize: '12px', textTransform: 'uppercase' }}>
                        {sale.paymentMethod}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          backgroundColor: sale.paymentStatus === 'paid' ? '#dcfce7' : '#fef3c7',
                          color: sale.paymentStatus === 'paid' ? '#166534' : '#92400e',
                        }}>
                          {sale.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
