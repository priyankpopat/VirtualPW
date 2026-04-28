// ========================================
// CREATE FIRST ADMIN USER
// ========================================
// Usage: node create-admin.js

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const adminName = process.argv[2] || 'Admin User';
const adminEmail = process.argv[3] || 'admin@example.com';
const adminPassword = process.argv[4] || 'admin123456';

async function createAdmin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/election-assistant');
        console.log('✓ MongoDB Connected');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('✗ Admin with this email already exists');
            process.exit(1);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // Create admin user
        const admin = new User({
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            role: 'admin'
        });

        await admin.save();

        console.log('✓ Admin user created successfully!');
        console.log(`  Email: ${adminEmail}`);
        console.log(`  Password: ${adminPassword}`);
        console.log('  (Change password after first login)');

        process.exit(0);
    } catch(err) {
        console.error('✗ Error:', err.message);
        process.exit(1);
    }
}

createAdmin();
