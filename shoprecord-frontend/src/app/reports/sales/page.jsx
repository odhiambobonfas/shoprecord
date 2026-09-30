'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout.component';
import Card from '../../../components/ui/Card.ui';
import Loading from '../../../components/ui/Loading.ui';
import saleService from '../../../services/saleService.service';
import { useCurrency } from '../../../hooks/useCurrency.hook';
import { formatDate } from '../../../utils/helpers.utils';

export default function SalesReportPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, today, week, month
  const { formatCurrency } = useCurrency();

  useEffect(() => {
    fetchSales();
  }, [filter]);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const data = await saleService.getAllSales();
      setSales(data);
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredSales = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    return sales.filter(sale => {
      const saleDate = new Date(sale.saleDate || sale.createdAt);
      if (filter === 'today') return saleDate >= today;
      if (filter === 'week') return saleDate >= weekAgo;
      if (filter === 'month') return saleDate >= monthAgo;
      return true;
    });
  };

  const filteredSales = getFilteredSales();
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalProfit = filteredSales.reduce((sum, sale) => sum + sale.totalProfit, 0);
  const averageSale = filteredSales.length > 0 ? totalRevenue / filteredSales.length : 0;

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

  const filterContainerStyles = {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
  };

  const filterButtonStyles = (isActive) => ({
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    background: isActive ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : '#f1f5f9',
    color: isActive ? '#fff' : '#64748b',
    transition: 'all 0.2s',
  });

  const statsGridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '24px',
  };

  const statCardStyles = {
    padding: '20px',
    background: '#fff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
  };

  const statLabelStyles = {
    fontSize: '13px',
    color: '#6b7280',
    marginBottom: '8px',
  };

  const statValueStyles = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
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

  if (loading) {
    return (
      <DashboardLayout>
        <Loading message="Loading sales report..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={headerStyles}>
        <h1 style={titleStyles}>📈 Sales Report</h1>
        <p style={subtitleStyles}>Analyze your sales performance</p>
      </div>

      <div style={filterContainerStyles}>
        <button 
          style={filterButtonStyles(filter === 'all')} 
          onClick={() => setFilter('all')}
        >
          All Time
        </button>
        <button 
          style={filterButtonStyles(filter === 'today')} 
          onClick={() => setFilter('today')}
        >
          Today
        </button>
        <button 
          style={filterButtonStyles(filter === 'week')} 
          onClick={() => setFilter('week')}
        >
          Last 7 Days
        </button>
        <button 
          style={filterButtonStyles(filter === 'month')} 
          onClick={() => setFilter('month')}
        >
          Last 30 Days
        </button>
      </div>

      <div style={statsGridStyles}>
        <div style={statCardStyles}>
          <div style={statLabelStyles}>Total Revenue</div>
          <div style={statValueStyles}>{formatCurrency(totalRevenue)}</div>
        </div>
        <div style={statCardStyles}>
          <div style={statLabelStyles}>Total Profit</div>
          <div style={statValueStyles}>{formatCurrency(totalProfit)}</div>
        </div>
        <div style={statCardStyles}>
          <div style={statLabelStyles}>Total Sales</div>
          <div style={statValueStyles}>{filteredSales.length}</div>
        </div>
        <div style={statCardStyles}>
          <div style={statLabelStyles}>Average Sale</div>
          <div style={statValueStyles}>{formatCurrency(averageSale)}</div>
        </div>
      </div>

      <Card>
        <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Recent Transactions</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyles}>
            <thead>
              <tr>
                <th style={thStyles}>Invoice</th>
                <th style={thStyles}>Date</th>
                <th style={thStyles}>Items</th>
                <th style={thStyles}>Amount</th>
                <th style={thStyles}>Profit</th>
                <th style={thStyles}>Payment</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ ...tdStyles, textAlign: 'center', padding: '40px' }}>
                    No sales found for this period
                  </td>
                </tr>
              ) : (
                filteredSales.slice(0, 20).map((sale) => (
                  <tr key={sale._id}>
                    <td style={tdStyles}>{sale.invoiceNumber}</td>
                    <td style={tdStyles}>{formatDate(sale.saleDate || sale.createdAt)}</td>
                    <td style={tdStyles}>{sale.items?.length || 0} items</td>
                    <td style={tdStyles}>{formatCurrency(sale.totalAmount)}</td>
                    <td style={{ ...tdStyles, color: '#10b981', fontWeight: '600' }}>
                      {formatCurrency(sale.totalProfit)}
                    </td>
                    <td style={tdStyles}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '600',
                        background: sale.paymentStatus === 'paid' ? '#d1fae5' : '#fef3c7',
                        color: sale.paymentStatus === 'paid' ? '#065f46' : '#92400e',
                      }}>
                        {sale.paymentStatus || 'paid'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
}
