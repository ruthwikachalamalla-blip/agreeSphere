const mongoose = require('mongoose');

async function connectDB() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing. Copy .env.example to .env and configure it.');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
}
module.exports = connectDB;
