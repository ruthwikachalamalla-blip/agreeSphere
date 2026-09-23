require('dotenv').config();
const express = require('express'); const cors = require('cors'); const morgan = require('morgan'); const connectDB = require('./config/db'); const { notFound, errorHandler } = require('./middleware/errors');
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : true })); app.use(express.json({ limit: '1mb' })); app.use(morgan('dev'));
app.get('/api/health', (req, res) => res.json({ status: 'ok', name: 'AgriSphere API' }));
app.use('/api/auth', require('./routes/authRoutes')); app.use('/api/users', require('./routes/userRoutes')); app.use('/api/products', require('./routes/productRoutes')); app.use('/api/cart', require('./routes/cartRoutes')); app.use('/api/orders', require('./routes/orderRoutes'));
app.use(notFound); app.use(errorHandler);
const port = process.env.PORT || 5000;
connectDB().then(() => app.listen(port, () => console.log(`AgriSphere API listening on ${port}`))).catch(err => { console.error(`Database startup failed: ${err.message}`); process.exit(1); });
