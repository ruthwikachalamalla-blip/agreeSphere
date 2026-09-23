const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
exports.get = asyncHandler(async (req, res) => res.json(await Cart.findOne({ user: req.user._id }).populate('items.product')));
exports.add = asyncHandler(async (req, res) => {
  const quantity = Number(req.body.quantity || 1); if (!Number.isInteger(quantity) || quantity < 1) return res.status(400).json({ message: 'Quantity must be a positive whole number.' });
  const product = await Product.findById(req.body.productId); if (!product) return res.status(404).json({ message: 'Product not found.' }); if (product.stock < quantity) return res.status(400).json({ message: 'Not enough stock available.' });
  let cart = await Cart.findOne({ user: req.user._id }); if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  const item = cart.items.find(i => i.product.equals(product._id)); if (item) item.quantity += quantity; else cart.items.push({ product: product._id, quantity });
  await cart.save(); res.json(await cart.populate('items.product'));
});
exports.update = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }); if (!cart) return res.status(404).json({ message: 'Cart is empty.' });
  const item = cart.items.find(i => i.product.equals(req.params.productId)); if (!item) return res.status(404).json({ message: 'Item not found in cart.' });
  const quantity = Number(req.body.quantity); if (!Number.isInteger(quantity) || quantity < 1) return res.status(400).json({ message: 'Quantity must be a positive whole number.' });
  const product = await Product.findById(item.product); if (product.stock < quantity) return res.status(400).json({ message: 'Not enough stock available.' }); item.quantity = quantity; await cart.save(); res.json(await cart.populate('items.product'));
});
exports.remove = asyncHandler(async (req, res) => { const cart = await Cart.findOne({ user: req.user._id }); if (cart) { cart.items = cart.items.filter(i => !i.product.equals(req.params.productId)); await cart.save(); } res.json(cart ? await cart.populate('items.product') : { items: [] }); });
