const mongoose = require('mongoose');

const FeaturesSchema = new mongoose.Schema({
    images: {
    type: [String],
    required: true,
    validate: [arr => arr.length > 0, 'At least one image is required.']
  },
},{timestamps:true})


module.exports = mongoose.model("Features",FeaturesSchema);