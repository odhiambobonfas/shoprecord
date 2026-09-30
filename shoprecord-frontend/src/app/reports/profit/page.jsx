'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout.component';
import Card from '../../../components/ui/Card.ui';
import Loading from '../../../components/ui/Loading.ui';
import saleService from '../../../services/saleService.service';
import { useCurrency } from '../../../hooks/useCurrency.hook';
import { formatDate } from '../../../utils/helpers.utils';

export default function ProfitAnalysisPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month'); // week, month, year
  const { formatCurrency } = useCurrency();

  useEffect(() => {
    fetchSales();
  }, []);

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
    const cutoffDate = new Date();
    
    if (period === 'week') {
      cutoffDate.setDate(now.getDate() - 7);
    } else if (period === 'month') {
      cutoffDate.setMonth(now.getMonth() - 1);
    } else if (period === 'year') {
      cutoffDate.setFullYear(now.getFullYear() - 1);
    }

    return sales.filter(sale => {
      const saleDate = new Date(sale.saleDate || sale.createdAt);
      return saleDate >= cutoffDate;
    });
  };

  const filteredSales = getFilteredSales();
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalCost = filteredSales.reduce((sum, sale) => sum + sale.totalCost, 0);
  const totalProfit = filteredSales.reduce((sum, sale) => sum + sale.totalProfit, 0);
  const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(2) : 0;
  const averageProfit = filteredSales.length > 0 ? totalProfit / filteredSales.length : 0;

  // Top profitable products
  const productProfits = {};
  filteredSales.forEach(sale => {
    sale.items?.forEach(item => {
      if (!productProfits[item.productName]) {
        productProfits[item.productName] = { profit: 0, quantity: 0, revenue: 0 };
      }
      productProfits[item.productName].profit += item.profit;
      productProfits[item.productName].quantity += item.quantity;
      productProfits[item.productName].revenue += item.subtotal;
    });
  });

  const topProducts = Object.entries(productProfits)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 10);

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
    background: isActive ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#f1f5f9',
    color: isActive ? '#fff' : '#64748b',
    transition: 'all 0.2s',
  });

  const statsGridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '24px',
  };

  const statCardStyles = (gradient) => ({
    padding: '24px',
    background: gradient,
    borderRadius: '12px',
    color: '#fff',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  });

  const statLabelStyles = {
    fontSize: '13px',
    opacity: '0.9',
    marginBottom: '8px',
  };

  const statValueStyles = {
    fontSize: '28px',
    fontWeight: '700',
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

  const progressBarContainerStyles = {
    width: '100%',
    height: '8px',
    background: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden',
    marginTop: '8px',
  };

  const progressBarStyles = (percentage, color) => ({
    width: `${percentage}%`,
    height: '100%',
    background: color,
    transition: 'width 0.3s ease',
  });

  if (loading) {
    return (
      <DashboardLayout>
        <Loading message="Loading profit analysis..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={headerStyles}>
        <h1 style={titleStyles}>💵 Profit Analysis</h1>
        <p style={subtitleStyles}>Track your profitability and margins</p>
      </div>

      <div style={filterContainerStyles}>
        <button 
          style={filterButtonStyles(period === 'week')} 
          onClick={() => setPeriod('week')}
        >
          Last 7 Days
        </button>
        <button 
          style={filterButtonStyles(period === 'month')} 
          onClick={() => setPeriod('month')}
        >
          Last 30 Days
        </button>
        <button 
          style={filterButtonStyles(period === 'year')} 
          onClick={() => setPeriod('year')}
        >
          Last Year
        </button>
      </div>

      <div style={statsGridStyles}>
        <div style={statCardStyles('linear-gradient(135deg, #10b981 0%, #059669 100%)')}>
          <div style={statLabelStyles}>💰 Total Profit</div>
          <div style={statValueStyles}>{formatCurrency(totalProfit)}</div>
        </div>
        <div style={statCardStyles('linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)')}>
          <div style={statLabelStyles}>📊 Revenue</div>
          <div style={statValueStyles}>{formatCurrency(totalRevenue)}</div>
        </div>
        <div style={statCardStyles('linear-gradient(135deg, #f59e0b 0%, #d97706 100%)')}>
          <div style={statLabelStyles}>💸 Cost</div>
          <div style={statValueStyles}>{formatCurrency(totalCost)}</div>
        </div>
        <div style={statCardStyles('linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)')}>
          <div style={statLabelStyles}>📈 Profit Margin</div>
          <div style={statValueStyles}>{profitMargin}%</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        <Card>
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>
            🏆 Top Profitable Products
          </h2>
          <table style={tableStyles}>
            <thead>
              <tr>
                <th style={thStyles}>Product</th>
                <th style={thStyles}>Sold</th>
                <th style={thStyles}>Revenue</th>
                <th style={thStyles}>Profit</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ ...tdStyles, textAlign: 'center', padding: '40px' }}>
                    No sales data available
                  </td>
                </tr>
              ) : (
                topProducts.map((product, index) => {
                  const profitPercentage = product.revenue > 0 ? (product.profit / product.revenue * 100) : 0;
                  return (
                    <tr key={index}>
                      <td style={tdStyles}>
                        <div style={{ fontWeight: '600' }}>{product.name}</div>
                        <div style={progressBarContainerStyles}>
                          <div style={progressBarStyles(profitPercentage, '#10b981')}></div>
                        </div>
                      </td>
                      <td style={tdStyles}>{product.quantity}</td>
                      <td style={tdStyles}>{formatCurrency(product.revenue)}</td>
                      <td style={{ ...tdStyles, color: '#10b981', fontWeight: '700' }}>
                        {formatCurrency(product.profit)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </Card>

        <Card>
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>
            📊 Profit Breakdown
          </h2>
          <div style={{ padding: '20px 0' }}>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>Average Profit per Sale</span>
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#10b981' }}>
                  {formatCurrency(averageProfit)}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>Total Sales Count</span>
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#3b82f6' }}>
                  {filteredSales.length}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>
                Profit vs Revenue Ratio
              </div>
              <div style={progressBarContainerStyles}>
                <div style={{
                  ...progressBarStyles(profitMargin, 'linear-gradient(90deg, #10b981, #059669)'),
                  height: '12px'
                }}></div>
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                {profitMargin}% profit margin
              </div>
            </div>

            <div style={{ 
              padding: '16px', 
              background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
              borderRadius: '8px',
              marginTop: '24px'
            }}>
              <div style={{ fontSize: '12px', color: '#1e40af', fontWeight: '600', marginBottom: '8px' }}>
                💡 Insight
              </div>
              <div style={{ fontSize: '13px', color: '#1e3a8a', lineHeight: '1.6' }}>
                {profitMargin > 30 ? 
                  'Excellent profit margins! Your business is performing great.' :
                  profitMargin > 15 ?
                  'Good profit margins. Consider optimizing costs to increase profitability.' :
                  'Low profit margins detected. Review your pricing strategy and cost structure.'
                }
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
