const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cartItems: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      salePrice: {
        type: Number,
        default: 0,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  addressInfo: {
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'In Process', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'Card', 'PayPal', 'UPI'],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending',
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  orderUpdateDate: {
    type: Date,
    default: Date.now,
  },
  paymentId: {
    type: String,
    default: null,
  },
  payerId: {
    type: String,
    default: null,
  },
},{ timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
