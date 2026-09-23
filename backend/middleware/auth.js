const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.startsWith('Bearer ') && req.headers.authorization.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Please sign in to continue.' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(payload.id);
    if (!req.user) return res.status(401).json({ message: 'Account not found.' });
    next();
  } catch { res.status(401).json({ message: 'Session expired. Please sign in again.' }); }
});
const authorize = (...roles) => (req, res, next) => roles.includes(req.user.role) ? next() : res.status(403).json({ message: 'You do not have permission to do that.' });
module.exports = { protect, authorize };
