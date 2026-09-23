const mongoose = require('mongoose');
const categories = ['Seeds', 'Fertilizers', 'Pesticides', 'Farming Tools', 'Irrigation Equipment', 'Organic Products', 'Animal Feed', 'Gardening Products'];
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, trim: true },
  category: { type: String, enum: categories, required: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0, default: 0 },
  image: { type: String, default: '' },
  unit: { type: String, default: 'each' },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  featured: { type: Boolean, default: false },
  rating: { type: Number, min: 0, max: 5, default: 4.5 }
}, { timestamps: true });
module.exports = mongoose.model('Product', productSchema);
