const asyncHandler = require('express-async-handler');
const Order = require('../models/Order'); const Cart = require('../models/Cart'); const Product = require('../models/Product');
exports.create = asyncHandler(async (req, res) => {
  if (!req.body.shippingAddress?.trim()) return res.status(400).json({ message: 'Shipping address is required.' });
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product'); if (!cart?.items.length) return res.status(400).json({ message: 'Your cart is empty.' });
  for (const item of cart.items) if (!item.product || item.product.stock < item.quantity) return res.status(400).json({ message: `${item.product?.name || 'An item'} no longer has enough stock.` });
  const items = cart.items.map(i => ({ product: i.product._id, name: i.product.name, image: i.product.image, seller: i.product.seller, quantity: i.quantity, price: i.product.price }));
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const order = await Order.create({ customer: req.user._id, items, total, shippingAddress: req.body.shippingAddress, paymentMethod: req.body.paymentMethod || 'Cash on delivery' });
  for (const item of cart.items) await Product.updateOne({ _id: item.product._id }, { $inc: { stock: -item.quantity } });
  cart.items = []; await cart.save(); res.status(201).json(order);
});
exports.list = asyncHandler(async (req, res) => {
  let filter = {}; if (req.user.role === 'customer') filter.customer = req.user._id;
  if (req.user.role === 'seller') filter['items.seller'] = req.user._id;
  res.json(await Order.find(filter).populate('customer', 'name email').sort({ createdAt: -1 }));
});
exports.updateStatus = asyncHandler(async (req, res) => {
  const allowed = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled']; if (!allowed.includes(req.body.status)) return res.status(400).json({ message: 'Invalid order status.' });
  const order = await Order.findById(req.params.id); if (!order) return res.status(404).json({ message: 'Order not found.' });
  if (req.user.role === 'seller' && !order.items.some(i => String(i.seller) === String(req.user._id))) return res.status(403).json({ message: 'This order does not belong to your products.' });
  order.status = req.body.status; await order.save(); res.json(order);
});
