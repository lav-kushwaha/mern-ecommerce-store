const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  images: {
    type: [String],
    required: true,
    validate: [arr => arr.length > 0, 'At least one image is required.']
  },
  title: { 
    type: String, 
    required: true
   },
  description: { 
    type: String, 
    required: true
   },
  category: { 
    type: String,
    required: true 
  },
  brand: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  salePrice: { 
    type: Number,
    required: true 
  },
  totalStock: { 
    type: Number, 
    required: true 
  },
  averageReview: Number,
}, { timestamps: true });

module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);
