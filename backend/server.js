require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errors');

const requiredEnvironment = ['MONGODB_URI', 'JWT_SECRET', 'CLIENT_URL'];
const missingEnvironment = requiredEnvironment.filter(name => !process.env[name]?.trim());
if (missingEnvironment.length) {
  console.error(`Missing required environment variables: ${missingEnvironment.join(', ')}`);
  process.exit(1);
}
if (process.env.JWT_SECRET.length < 32) {
  console.error('JWT_SECRET must be at least 32 characters long.');
  process.exit(1);
}

const app = express();
// Normalize configured origins so a trailing slash in Render's CLIENT_URL does not
// cause an otherwise valid browser Origin header to be rejected.
const allowedOrigins = process.env.CLIENT_URL.split(',')
  .map(origin => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean);
app.disable('x-powered-by');
app.use(cors({
  origin(origin, callback) {
    // Requests without an Origin header (health checks and server-to-server calls) are allowed.
    callback(null, !origin || allowedOrigins.includes(origin));
  }
}));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'tiny' : 'dev'));
app.get('/api/health', (req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;
  res.status(databaseReady ? 200 : 503).json({
    status: databaseReady ? 'ok' : 'unavailable',
    database: databaseReady ? 'connected' : 'disconnected',
    name: 'AgriSphere API'
  });
});
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
connectDB()
  .then(() => app.listen(port, '0.0.0.0', () => console.log(`AgriSphere API listening on ${port}`)))
  .catch(err => {
    console.error(`Database startup failed: ${err.message}`);
    process.exit(1);
  });
