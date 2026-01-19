import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from '../src/models/User.js';

// Get the directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGO_URI;

// Test users to seed
const users = [
  {
    name: 'Admin User',
    email: 'admin@restaurant.com',
    password: 'admin123',
    phone: '+1234567890',
    role: 'admin'
  },
  {
    name: 'Kitchen Staff',
    email: 'kitchen@restaurant.com',
    password: 'kitchen123',
    phone: '+1234567891',
    role: 'kitchen'
  },
  {
    name: 'Test Customer',
    email: 'customer@test.com',
    password: 'customer123',
    phone: '+1234567892',
    role: 'customer'
  }
];

const seedUsers = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n🗑️  Clearing existing users...');
    await User.deleteMany({});
    console.log('✅ Users cleared');

    console.log('\n👥 Creating users...');
    
    for (const userData of users) {
      // Create user - password will be hashed by the User model's pre-save hook
      const user = await User.create(userData);

      console.log(`✅ Created ${user.role}: ${user.email} (password: ${userData.password})`);
    }

    console.log('\n✨ User seeding completed successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('─────────────────────────────────────────────');
    users.forEach(u => {
      console.log(`${u.role.toUpperCase().padEnd(10)} | Email: ${u.email.padEnd(25)} | Password: ${u.password}`);
    });
    console.log('─────────────────────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
