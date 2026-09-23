const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
exports.list = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.search) filter.$or = [{ name: new RegExp(req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }, { description: new RegExp(req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }];
  if (req.query.seller) filter.seller = req.query.seller;
  if (req.query.featured === 'true') filter.featured = true;
  res.json(await Product.find(filter).populate('seller', 'name').sort({ featured: -1, createdAt: -1 }));
});
exports.get = asyncHandler(async (req, res) => { const p = await Product.findById(req.params.id).populate('seller', 'name'); if (!p) return res.status(404).json({ message: 'Product not found.' }); res.json(p); });
exports.create = asyncHandler(async (req, res) => res.status(201).json(await Product.create({ ...req.body, seller: req.user._id })));
exports.update = asyncHandler(async (req, res) => { const p = await Product.findById(req.params.id); if (!p) return res.status(404).json({ message: 'Product not found.' }); if (req.user.role !== 'admin' && !p.seller.equals(req.user._id)) return res.status(403).json({ message: 'You can only edit your own products.' }); Object.assign(p, req.body); await p.save(); res.json(p); });
exports.remove = asyncHandler(async (req, res) => { const p = await Product.findById(req.params.id); if (!p) return res.status(404).json({ message: 'Product not found.' }); if (req.user.role !== 'admin' && !p.seller.equals(req.user._id)) return res.status(403).json({ message: 'You can only remove your own products.' }); await p.deleteOne(); res.json({ message: 'Product removed.' }); });
