const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'User' 
},
  address: { 
    type: String,
     required: true
     },
  city: { 
    type: String, 
    required: true 
},
  pincode: { 
    type: String, 
    required: true
 },
  phone: { 
    type: String,
    required: true 
},
  notes: { 
    type: String,
     required: true
 },
}, { timestamps: true });

module.exports = mongoose.model('Address', addressSchema);
