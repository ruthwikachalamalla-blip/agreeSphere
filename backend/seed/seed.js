require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');

const sellers = [
  { name: 'Green Valley Farm', email: 'farmer@agrisphere.demo', passwordEnv: 'FARMER_PASSWORD', role: 'seller', phone: '+91 98765 43210', address: 'Nashik, Maharashtra' },
  { name: 'Sunrise Agri Store', email: 'store@agrisphere.demo', passwordEnv: 'STORE_PASSWORD', role: 'seller', address: 'Pune, Maharashtra' }
];

const products = [
  ['Hybrid Tomato Seeds', 'Seeds', 349, 'High-yield, disease-resistant tomato seeds. Great germination for a healthy crop.', 'seeds', 42],
  ['Premium Wheat Seeds', 'Seeds', 899, 'Certified wheat variety selected for reliable yields and strong stems.', 'wheat', 27],
  ['Organic Vermicompost', 'Fertilizers', 249, 'Nutrient-rich, naturally processed vermicompost for healthier soil.', 'compost', 65],
  ['NPK 19:19:19 Fertilizer', 'Fertilizers', 620, 'Balanced, water-soluble nutrition for vigorous growth at every stage.', 'fertilizer', 31],
  ['Neem Oil Plant Spray', 'Pesticides', 189, 'Plant-based neem solution to help protect your garden and crops.', 'neem', 80],
  ['Stainless Steel Hand Cultivator', 'Farming Tools', 425, 'Ergonomic three-prong hand cultivator for beds, pots and small plots.', 'cultivator', 18],
  ['Drip Irrigation Starter Kit', 'Irrigation Equipment', 1799, 'Water-saving drip kit for up to 100 plants, with connectors and filter.', 'drip', 12],
  ['Cold-Pressed Mustard Cake', 'Organic Products', 310, 'Traditional organic soil amendment with a slow release of nutrients.', 'organic', 45],
  ['NutriGrow Cattle Feed 25kg', 'Animal Feed', 1150, 'Balanced daily feed mix for healthy dairy cattle and better nutrition.', 'cattle', 22],
  ['Terracotta Herb Planter Set', 'Gardening Products', 550, 'Set of three breathable terracotta planters for kitchen herbs.', 'planter', 34],
  ['Handheld Pruning Shears', 'Farming Tools', 680, 'Sharp, comfortable bypass shears for clean pruning of shrubs and vines.', 'shears', 15],
  ['Natural Seaweed Extract', 'Organic Products', 390, 'Concentrated plant tonic made from seaweed for thriving crops.', 'seaweed', 50]
];

const photoIds = [
  '1518977676601-b53f82aba655', '1574323347407-f5e1ad6d020b', '1587049352851-8d4e89133924',
  '1592982537447-7440770cbfc9', '1563207153-f403bf289096', '1416879595882-3373a0480b5b',
  '1563514227147-6d2ff665a6a0', '1601004890684-d8cbf643f5f2', '1589923188900-85dae523342b',
  '1485955900006-10f4d324d411', '1598300056393-4aac492f4344', '1597362925123-77861d3fbac7'
];

async function seed() {
  if (!process.env.MONGODB_URI) throw new Error('Set MONGODB_URI in backend/.env first.');
  const passwordVariables = ['ADMIN_PASSWORD', ...sellers.map(seller => seller.passwordEnv)];
  const missingPasswords = passwordVariables.filter(name => !process.env[name] || process.env[name].length < 8);
  if (missingPasswords.length) {
    throw new Error(`Set private passwords of at least 8 characters for: ${missingPasswords.join(', ')} in backend/.env.`);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  const adminEmail = 'admin@agrisphere.demo';
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
  await User.findOneAndUpdate(
    { email: adminEmail },
    { name: 'AgriSphere Admin', email: adminEmail, password: adminPassword, role: 'admin' },
    { upsert: true, new: true, runValidators: true }
  );

  const farmerDocs = [];
  for (const seller of sellers) {
    const password = await bcrypt.hash(process.env[seller.passwordEnv], 12);
    const { passwordEnv, ...sellerData } = seller;
    farmerDocs.push(await User.findOneAndUpdate(
      { email: seller.email },
      { ...sellerData, password },
      { upsert: true, new: true, runValidators: true }
    ));
  }

  await Product.deleteMany({});
  await Product.insertMany(products.map((product, index) => ({
    name: product[0], category: product[1], price: product[2], description: product[3],
    image: `https://images.unsplash.com/photo-${photoIds[index]}?auto=format&fit=crop&w=900&q=80`,
    seller: farmerDocs[index % farmerDocs.length]._id, stock: product[5],
    unit: index === 2 ? '5 kg bag' : 'pack', featured: index < 8,
    rating: 4.5 + ((index % 4) * 0.1)
  })));
  console.log(`Seeded ${products.length} products. Admin account: ${adminEmail}. Passwords are configured in backend/.env.`);
  await mongoose.disconnect();
}

seed().catch(error => {
  console.error(error.message);
  mongoose.disconnect().finally(() => process.exit(1));
});
