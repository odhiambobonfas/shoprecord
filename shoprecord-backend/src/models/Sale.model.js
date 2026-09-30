const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  costPrice: {
    type: Number,
    required: true,
    min: [0, 'Cost price cannot be negative'],
  },
  sellingPrice: {
    type: Number,
    required: true,
    min: [0, 'Selling price cannot be negative'],
  },
  subtotal: {
    type: Number,
    required: true,
  },
  profit: {
    type: Number,
    required: true,
  },
});

const saleSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    items: [saleItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount cannot be negative'],
    },
    totalCost: {
      type: Number,
      required: true,
      min: [0, 'Total cost cannot be negative'],
    },
    totalProfit: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'upi', 'bank_transfer', 'other'],
      default: 'cash',
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'pending', 'partial', 'refunded'],
      default: 'paid',
    },
    amountPaid: {
      type: Number,
      min: [0, 'Amount paid cannot be negative'],
      default: 0,
    },
    amountDue: {
      type: Number,
      min: [0, 'Amount due cannot be negative'],
      default: 0,
    },
    customer: {
      name: {
        type: String,
        trim: true,
        default: 'Walk-in Customer',
      },
      phone: {
        type: String,
        trim: true,
        default: '',
      },
      email: {
        type: String,
        trim: true,
        default: '',
      },
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
    discount: {
      type: Number,
      min: [0, 'Discount cannot be negative'],
      default: 0,
    },
    tax: {
      type: Number,
      min: [0, 'Tax cannot be negative'],
      default: 0,
    },
    saleDate: {
      type: Date,
      default: Date.now,
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

// Add indexes for performance
saleSchema.index({ user: 1, saleDate: -1 });
saleSchema.index({ saleDate: -1 });
saleSchema.index({ 'customer.phone': 1 });

// Pre-save hook to generate invoice number
saleSchema.pre('save', async function(next) {
  if (this.isNew && !this.invoiceNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    // Find the last invoice for this user
    const lastSale = await this.constructor.findOne({ user: this.user })
      .sort({ createdAt: -1 })
      .select('invoiceNumber');
    
    let sequence = 1;
    if (lastSale && lastSale.invoiceNumber) {
      const lastSequence = parseInt(lastSale.invoiceNumber.split('-').pop());
      if (!isNaN(lastSequence)) {
        sequence = lastSequence + 1;
      }
    }
    
    this.invoiceNumber = `INV-${year}${month}-${String(sequence).padStart(5, '0')}`;
  }
  next();
});

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;
