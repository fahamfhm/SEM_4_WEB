import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuItemId: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: true
  },
  basePrice: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  customizations: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  itemTotal: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: false,
    unique: true
  },
  // User reference for authenticated customers
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  // Guest session information
  guestSessionId: {
    type: String,
    required: false
  },
  guestInfo: {
    name: {
      type: String,
      required: false
    },
    phone: {
      type: String,
      required: false
    }
  },
  // Order items
  items: [orderItemSchema],
  
  // Order details
  orderType: {
    type: String,
    enum: ['dine-in', 'takeaway'],
    required: true
  },
  tableNumber: {
    type: String,
    required: false
  },
  
  // Pricing
  subtotal: {
    type: Number,
    required: true
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  
  // Payment
  paymentMethod: {
    type: String,
    enum: ['card', 'cash'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  
  // Order status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled'],
    default: 'pending'
  },
  
  // Additional information
  specialNotes: {
    type: String,
    default: ''
  },
  
  // Timestamps
  orderedAt: {
    type: Date,
    default: Date.now
  },
  confirmedAt: Date,
  preparedAt: Date,
  completedAt: Date,
  cancelledAt: Date
}, {
  timestamps: true
});

// Index for faster queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ guestSessionId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

// Virtual for order age
orderSchema.virtual('age').get(function() {
  return Math.floor((Date.now() - this.orderedAt) / (1000 * 60)); // age in minutes
});

// Method to check if order can be cancelled
orderSchema.methods.canBeCancelled = function() {
  return ['pending', 'confirmed'].includes(this.status);
};

// Method to check if order is from guest
orderSchema.methods.isGuestOrder = function() {
  return !this.user && this.guestSessionId;
};

export default mongoose.model('Order', orderSchema);
