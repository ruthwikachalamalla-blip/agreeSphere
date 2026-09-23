const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const tokenFor = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const publicUser = user => ({ _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, address: user.address });
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required.' });
  if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters.' });
  const user = await User.create({ name, email, password, role: role === 'seller' ? 'seller' : 'customer' });
  res.status(201).json({ token: tokenFor(user._id), user: publicUser(user) });
});
exports.login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email?.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(req.body.password || ''))) return res.status(401).json({ message: 'Email or password is incorrect.' });
  res.json({ token: tokenFor(user._id), user: publicUser(user) });
});
exports.me = asyncHandler(async (req, res) => res.json({ user: publicUser(req.user) }));
