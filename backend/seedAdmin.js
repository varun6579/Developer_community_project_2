require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

const seedAdmin = async () => {
  try {
    await connectDB();

    // Delete existing admin to recreate with correct password
    await Admin.deleteOne({ email: 'admin@example.com' });

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = new Admin({
      name: 'Super Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'Super Admin'
    });

    await admin.save();
    console.log('✅ Super Admin created successfully (admin@example.com / admin123)');
    process.exit();
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

seedAdmin();
