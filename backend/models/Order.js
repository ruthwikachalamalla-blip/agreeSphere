const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, name: String, image: String, seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, quantity: Number, price: Number }],
  shippingAddress: { type: String, required: true },
  total: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'placed' },
  paymentMethod: { type: String, default: 'Cash on delivery' }
}, { timestamps: true });
module.exports = mongoose.model('Order', orderSchema);
