import api from './api.service';

const saleService = {
  // Create a new sale
  createSale: async (saleData) => {
    const response = await api('/sales', {
      method: 'POST',
      body: JSON.stringify(saleData),
    });
    return response.data;
  },

  // Get all sales
  getSales: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.paymentMethod) params.append('paymentMethod', filters.paymentMethod);
    if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const queryString = params.toString();
    const url = queryString ? `/sales?${queryString}` : '/sales';
    
    const response = await api(url);
    return response;
  },

  // Get single sale
  getSale: async (id) => {
    const response = await api(`/sales/${id}`);
    return response.data;
  },

  // Get sales analytics
  getSalesAnalytics: async (period = 'today') => {
    const response = await api(`/sales/analytics/summary?period=${period}`);
    return response.data;
  },

  // Update payment status
  updatePaymentStatus: async (id, paymentData) => {
    const response = await api(`/sales/${id}/payment`, {
      method: 'PUT',
      body: JSON.stringify(paymentData),
    });
    return response.data;
  },

  // Delete sale (refund)
  deleteSale: async (id) => {
    const response = await api(`/sales/${id}`, {
      method: 'DELETE',
    });
    return response.data;
  },

  // Get today's sales summary
  getTodaySummary: async () => {
    return await saleService.getSalesAnalytics('today');
  },

  // Get weekly sales summary
  getWeeklySummary: async () => {
    return await saleService.getSalesAnalytics('week');
  },

  // Get monthly sales summary
  getMonthlySummary: async () => {
    return await saleService.getSalesAnalytics('month');
  },

  // Get yearly sales summary
  getYearlySummary: async () => {
    return await saleService.getSalesAnalytics('year');
  },
};

export default saleService;
