const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      minlength: [2, 'Product name must be at least 2 characters'],
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    category: {
      type: String,
      trim: true,
      maxlength: [50, 'Category cannot exceed 50 characters'],
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Please provide a selling price'],
      min: [0, 'Price cannot be negative'],
    },
    costPrice: {
      type: Number,
      required: [true, 'Please provide a cost price'],
      min: [0, 'Cost price cannot be negative'],
      default: 0,
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide a quantity'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    minStockLevel: {
      type: Number,
      min: [0, 'Minimum stock level cannot be negative'],
      default: 5,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
    manufacturingDate: {
      type: Date,
      default: null,
    },
    batchNumber: {
      type: String,
      trim: true,
      maxlength: [50, 'Batch number cannot exceed 50 characters'],
      default: '',
    },
    sku: {
      type: String,
      trim: true,
      maxlength: [50, 'SKU cannot exceed 50 characters'],
      default: '',
    },
    barcode: {
      type: String,
      trim: true,
      maxlength: [50, 'Barcode cannot exceed 50 characters'],
      default: '',
    },
    unit: {
      type: String,
      enum: ['pieces', 'kg', 'grams', 'liters', 'ml', 'boxes', 'packets', 'bottles', 'other'],
      default: 'pieces',
    },
    image: {
      type: String,
      default: '',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for search functionality
productSchema.index({ name: 'text', description: 'text', category: 'text' });

// Add index for user to improve query performance
productSchema.index({ user: 1, createdAt: -1 });

// Add index for expiry date queries
productSchema.index({ expiryDate: 1 });

// Virtual for profit margin
productSchema.virtual('profitMargin').get(function() {
  if (this.costPrice && this.price) {
    return ((this.price - this.costPrice) / this.costPrice * 100).toFixed(2);
  }
  return 0;
});

// Virtual for profit amount
productSchema.virtual('profitAmount').get(function() {
  return this.price - this.costPrice;
});

// Virtual to check if product is expired
productSchema.virtual('isExpired').get(function() {
  if (!this.expiryDate) return false;
  return new Date() > new Date(this.expiryDate);
});

// Virtual to check if product is near expiry (within 7 days)
productSchema.virtual('isNearExpiry').get(function() {
  if (!this.expiryDate) return false;
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  return new Date() <= new Date(this.expiryDate) && new Date(this.expiryDate) <= sevenDaysFromNow;
});

// Virtual to check if product is low stock
productSchema.virtual('isLowStock').get(function() {
  return this.quantity <= this.minStockLevel && this.quantity > 0;
});

// Virtual to check if product is out of stock
productSchema.virtual('isOutOfStock').get(function() {
  return this.quantity === 0;
});

// Ensure virtuals are included in JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
