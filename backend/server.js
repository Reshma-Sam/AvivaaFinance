import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import loanRoutes from './routes/loans.js';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Allow larger payloads for Base64 document uploads (kyc images)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Enable CORS
app.use(cors({
  origin: '*', // Allow all origins for development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);

// Welcome Route
app.get('/', (req, res) => {
  res.json({ message: 'Avivaa Finance API is running successfully!' });
});

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// Auto-seed admin user account
const seedAdminUser = async () => {
  try {
    const adminEmail = 'avivafinance398@gmail.com';
    const adminPassword = 'avivafinance398';
    
    const existingUser = await User.findOne({ email: adminEmail });
    if (!existingUser) {
      console.log('Seeding admin user account...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      
      const newAdmin = new User({
        username: 'avivafinance398',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      
      await newAdmin.save();
      console.log('Admin account successfully seeded: avivafinance398@gmail.com');
    } else {
      console.log('Admin account already exists in database.');
    }
  } catch (err) {
    console.error('Error seeding admin user:', err.message);
  }
};

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://avivafinance398_db_user:1nOMziMVK6k9zAT0@cluster0.s4ra7du.mongodb.net/avivaa?appName=Cluster0';
const LOCAL_MONGODB_URI = 'mongodb://127.0.0.1:27017/avivaa';

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Backend Server is running on port ${PORT}`);
  });
};

const connectDB = async () => {
  console.log('Connecting to MongoDB Atlas...');
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB Atlas Cluster');
    await seedAdminUser();
    startServer();
  } catch (err) {
    console.error('MongoDB Atlas connection failed:', err.message);
    console.log('Attempting fallback to local MongoDB instance...');
    try {
      await mongoose.connect(LOCAL_MONGODB_URI);
      console.log('Successfully connected to local MongoDB instance');
      await seedAdminUser();
      startServer();
    } catch (localErr) {
      console.error('\n========================================================================');
      console.error('DATABASE CONNECTION ERROR:');
      console.error('Could not connect to MongoDB Atlas or local MongoDB.');
      console.error('\nHow to fix the MongoDB Atlas IP Whitelist issue:');
      console.error('1. Sign in to your MongoDB Atlas dashboard (https://cloud.mongodb.com).');
      console.error('2. Go to "Network Access" under the "Security" section in the left sidebar.');
      console.error('3. Click the "+ Add IP Address" button.');
      console.error('4. Click "ALLOW ACCESS FROM ANYWHERE" (adds IP 0.0.0.0/0) or add your current IP.');
      console.error('5. Click "Confirm" and wait 1-2 minutes for the whitelist to deploy.');
      console.error('6. Restart this server by running: npm start');
      console.error('========================================================================\n');
      process.exit(1);
    }
  }
};

connectDB();
