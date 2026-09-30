const Sale = require('../models/Sale.model');
const Product = require('../models/Product.model');

// @desc    Create a new sale
// @route   POST /api/sales
// @access  Private
exports.createSale = async (req, res, next) => {
  try {
    const { items, paymentMethod, paymentStatus, amountPaid, customer, notes, discount, tax } = req.body;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please add at least one item to the sale',
      });
    }

    let totalAmount = 0;
    let totalCost = 0;
    let totalProfit = 0;
    const processedItems = [];

    // Process each item
    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`,
        });
      }

      // Check if product belongs to user
      if (product.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to sell this product',
        });
      }

      // Check stock availability
      if (product.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.quantity}`,
        });
      }

      // Check if product is expired
      if (product.expiryDate && new Date(product.expiryDate) < new Date()) {
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} has expired`,
        });
      }

      const sellingPrice = item.sellingPrice || product.price;
      const costPrice = product.costPrice || 0;
      const subtotal = sellingPrice * item.quantity;
      const profit = (sellingPrice - costPrice) * item.quantity;

      processedItems.push({
        product: product._id,
        productName: product.name,
        quantity: item.quantity,
        costPrice: costPrice,
        sellingPrice: sellingPrice,
        subtotal: subtotal,
        profit: profit,
      });

      totalAmount += subtotal;
      totalCost += costPrice * item.quantity;
      totalProfit += profit;

      // Update product quantity
      product.quantity -= item.quantity;
      await product.save();
    }

    // Apply discount and tax
    const discountAmount = discount || 0;
    const taxAmount = tax || 0;
    const finalAmount = totalAmount - discountAmount + taxAmount;
    const amountDue = finalAmount - (amountPaid || 0);

    // Create sale
    const sale = await Sale.create({
      items: processedItems,
      totalAmount: finalAmount,
      totalCost: totalCost,
      totalProfit: totalProfit,
      paymentMethod: paymentMethod || 'cash',
      paymentStatus: paymentStatus || 'paid',
      amountPaid: amountPaid || finalAmount,
      amountDue: amountDue > 0 ? amountDue : 0,
      customer: customer || { name: 'Walk-in Customer' },
      notes: notes || '',
      discount: discountAmount,
      tax: taxAmount,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: sale,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all sales for user
// @route   GET /api/sales
// @access  Private
exports.getSales = async (req, res, next) => {
  try {
    const { startDate, endDate, paymentMethod, paymentStatus, page = 1, limit = 20 } = req.query;

    const query = { user: req.user.id };

    // Filter by date range
    if (startDate || endDate) {
      query.saleDate = {};
      if (startDate) query.saleDate.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.saleDate.$lte = end;
      }
    }

    // Filter by payment method
    if (paymentMethod) {
      query.paymentMethod = paymentMethod;
    }

    // Filter by payment status
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const sales = await Sale.find(query)
      .populate('items.product', 'name category')
      .sort({ saleDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Sale.countDocuments(query);

    res.status(200).json({
      success: true,
      count: sales.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: sales,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single sale
// @route   GET /api/sales/:id
// @access  Private
exports.getSale = async (req, res, next) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('items.product', 'name category unit')
      .populate('user', 'name email');

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Sale not found',
      });
    }

    // Check if sale belongs to user
    if (sale.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this sale',
      });
    }

    res.status(200).json({
      success: true,
      data: sale,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get sales analytics
// @route   GET /api/sales/analytics/summary
// @access  Private
exports.getSalesAnalytics = async (req, res, next) => {
  try {
    const { period = 'today' } = req.query;
    
    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    switch (period) {
      case 'today':
        // Already set to today
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    const sales = await Sale.find({
      user: req.user.id,
      saleDate: { $gte: startDate },
    });

    const analytics = {
      totalSales: sales.length,
      totalRevenue: sales.reduce((sum, sale) => sum + sale.totalAmount, 0),
      totalProfit: sales.reduce((sum, sale) => sum + sale.totalProfit, 0),
      totalCost: sales.reduce((sum, sale) => sum + sale.totalCost, 0),
      averageSaleValue: sales.length > 0 ? sales.reduce((sum, sale) => sum + sale.totalAmount, 0) / sales.length : 0,
      paymentMethods: {},
      dailySales: {},
    };

    // Group by payment method
    sales.forEach(sale => {
      if (!analytics.paymentMethods[sale.paymentMethod]) {
        analytics.paymentMethods[sale.paymentMethod] = {
          count: 0,
          amount: 0,
        };
      }
      analytics.paymentMethods[sale.paymentMethod].count++;
      analytics.paymentMethods[sale.paymentMethod].amount += sale.totalAmount;
    });

    // Group by date
    sales.forEach(sale => {
      const date = new Date(sale.saleDate).toISOString().split('T')[0];
      if (!analytics.dailySales[date]) {
        analytics.dailySales[date] = {
          count: 0,
          revenue: 0,
          profit: 0,
        };
      }
      analytics.dailySales[date].count++;
      analytics.dailySales[date].revenue += sale.totalAmount;
      analytics.dailySales[date].profit += sale.totalProfit;
    });

    res.status(200).json({
      success: true,
      period,
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update sale payment status
// @route   PUT /api/sales/:id/payment
// @access  Private
exports.updatePaymentStatus = async (req, res, next) => {
  try {
    const { paymentStatus, amountPaid } = req.body;

    let sale = await Sale.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Sale not found',
      });
    }

    // Check if sale belongs to user
    if (sale.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this sale',
      });
    }

    if (paymentStatus) {
      sale.paymentStatus = paymentStatus;
    }

    if (amountPaid !== undefined) {
      sale.amountPaid = amountPaid;
      sale.amountDue = sale.totalAmount - amountPaid;
      if (sale.amountDue <= 0) {
        sale.paymentStatus = 'paid';
        sale.amountDue = 0;
      }
    }

    await sale.save();

    res.status(200).json({
      success: true,
      data: sale,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete sale (refund)
// @route   DELETE /api/sales/:id
// @access  Private
exports.deleteSale = async (req, res, next) => {
  try {
    const sale = await Sale.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Sale not found',
      });
    }

    // Check if sale belongs to user
    if (sale.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this sale',
      });
    }

    // Restore product quantities
    for (const item of sale.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.quantity += item.quantity;
        await product.save();
      }
    }

    await sale.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Sale deleted and stock restored',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
