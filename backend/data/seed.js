import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const seedData = async () => {
  try {
    // 1. Clean existing collections
    console.log('Clearing existing database collections...');
    await User.deleteMany();
    await Order.deleteMany();
    await Payment.deleteMany();
    console.log('Database cleared.');

    // 2. Define dummy users
    console.log('Seeding Users...');
    
    // We use User.create instead of insertMany so password pre-save hooks execute
    const admin = await User.create({
      fullName: 'Jiva Admin',
      email: 'admin@jivahealth.com',
      phone: '+1-555-0199',
      password: 'adminpassword123',
      role: 'Admin',
      status: 'Active',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=admin',
      gender: 'Male',
      dob: new Date('1985-05-15'),
      bloodGroup: 'B+',
    });

    const nurse = await User.create({
      fullName: 'Sarah Jenkins (Nurse)',
      email: 'nurse@jivahealth.com',
      phone: '+1-555-0188',
      password: 'nursepassword123',
      role: 'Nurse',
      status: 'Active',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=nurse',
      gender: 'Female',
      dob: new Date('1992-09-22'),
      bloodGroup: 'A+',
    });

    const patient1 = await User.create({
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1-555-0101',
      password: 'patientpassword123',
      role: 'Patient',
      status: 'Active',
      isPrime: true,
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=john',
      gender: 'Male',
      dob: new Date('1988-12-05'),
      bloodGroup: 'O+',
      appointmentsCount: 5,
      totalOrders: 2,
      totalSpent: 185.50,
      addresses: [
        {
          type: 'Home',
          addressLine: '123 Main St, Apt 4B',
          city: 'New York',
          state: 'NY',
          pincode: '10001',
          isDefault: true,
        },
        {
          type: 'Work',
          addressLine: '456 Broadway Blvd',
          city: 'New York',
          state: 'NY',
          pincode: '10012',
          isDefault: false,
        }
      ],
      familyMembers: [
        {
          name: 'Jane Doe',
          relationship: 'Spouse',
          dob: new Date('1990-08-14'),
          phone: '+1-555-0102',
        },
        {
          name: 'Jimmy Doe',
          relationship: 'Child',
          dob: new Date('2015-05-22'),
          phone: '',
        }
      ]
    });

    const patient2 = await User.create({
      fullName: 'Mary Jane',
      email: 'mary.jane@example.com',
      phone: '+1-555-0103',
      password: 'patientpassword123',
      role: 'Patient',
      status: 'Active',
      isPrime: false,
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=mary',
      gender: 'Female',
      dob: new Date('1995-07-19'),
      bloodGroup: 'A-',
      appointmentsCount: 2,
      totalOrders: 1,
      totalSpent: 45.00,
      addresses: [
        {
          type: 'Home',
          addressLine: '789 Elm St',
          city: 'Newark',
          state: 'NJ',
          pincode: '07101',
          isDefault: true,
        }
      ],
      familyMembers: []
    });

    const patient3 = await User.create({
      fullName: 'Bob Johnson',
      email: 'bob.j@example.com',
      phone: '+1-555-0104',
      password: 'patientpassword123',
      role: 'Patient',
      status: 'Inactive',
      isPrime: false,
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=bob',
      gender: 'Male',
      dob: new Date('1975-02-28'),
      bloodGroup: 'AB+',
      appointmentsCount: 0,
      totalOrders: 0,
      totalSpent: 0,
      addresses: [],
      familyMembers: []
    });

    console.log(`Users seeded successfully: Admin, Nurse, and 3 Patients created.`);

    // 3. Define dummy orders
    console.log('Seeding Orders...');
    
    const orders = [
      {
        userId: patient1._id,
        orderItems: [
          {
            name: 'Multivitamins Daily Pack (30 Capsules)',
            quantity: 2,
            price: 29.99,
            image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150'
          },
          {
            name: 'Omega-3 Fish Oil (90 Softgels)',
            quantity: 1,
            price: 25.52,
            image: 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=150'
          }
        ],
        totalAmount: 85.50,
        paymentMethod: 'Credit Card',
        paymentStatus: 'Completed',
        orderStatus: 'Delivered',
        shippingAddress: patient1.addresses[0], // Home address
        deliveredAt: new Date('2026-05-20T10:00:00Z'),
        createdAt: new Date('2026-05-20T09:45:00Z'),
      },
      {
        userId: patient1._id,
        orderItems: [
          {
            name: 'Digital Blood Pressure Monitor',
            quantity: 1,
            price: 100.00,
            image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=150'
          }
        ],
        totalAmount: 100.00,
        paymentMethod: 'PayPal',
        paymentStatus: 'Completed',
        orderStatus: 'Processing',
        shippingAddress: patient1.addresses[0], // Home address
        createdAt: new Date('2026-05-22T14:10:00Z'),
      },
      {
        userId: patient2._id,
        orderItems: [
          {
            name: 'Premium Whey Protein Powder 1kg',
            quantity: 1,
            price: 45.00,
            image: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=150'
          }
        ],
        totalAmount: 45.00,
        paymentMethod: 'Debit Card',
        paymentStatus: 'Completed',
        orderStatus: 'Delivered',
        shippingAddress: patient2.addresses[0], // Home address
        deliveredAt: new Date('2026-05-24T15:30:00Z'),
        createdAt: new Date('2026-05-24T15:12:00Z'),
      },
      {
        userId: patient2._id,
        orderItems: [
          {
            name: 'Immunity Booster Combo Pack',
            quantity: 1,
            price: 35.00,
            image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=150'
          }
        ],
        totalAmount: 35.00,
        paymentMethod: 'Credit Card',
        paymentStatus: 'Pending',
        orderStatus: 'Pending',
        shippingAddress: patient2.addresses[0], // Home address
        createdAt: new Date('2026-05-26T12:00:00Z'),
      }
    ];

    const seededOrders = await Order.create(orders);
    console.log(`Seeded ${seededOrders.length} orders successfully.`);

    // 4. Define dummy payments
    console.log('Seeding Payments...');

    const payments = [
      {
        userId: patient1._id,
        paymentId: 'TXN-10001',
        amount: 85.50,
        method: 'Credit Card',
        status: 'Completed',
        transactionDate: new Date('2026-05-20T09:45:00Z'),
      },
      {
        userId: patient1._id,
        paymentId: 'TXN-10002',
        amount: 100.00,
        method: 'PayPal',
        status: 'Completed',
        transactionDate: new Date('2026-05-22T14:10:00Z'),
      },
      {
        userId: patient2._id,
        paymentId: 'TXN-20001',
        amount: 45.00,
        method: 'Debit Card',
        status: 'Completed',
        transactionDate: new Date('2026-05-24T15:12:00Z'),
      },
      {
        userId: patient2._id,
        paymentId: 'TXN-20002',
        amount: 35.00,
        method: 'Credit Card',
        status: 'Pending',
        transactionDate: new Date('2026-05-26T12:00:00Z'),
      }
    ];

    const seededPayments = await Payment.create(payments);
    console.log(`Seeded ${seededPayments.length} payment records successfully.`);

    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error failed: ${error.message}`);
    process.exit(1);
  }
};

// Start execution
seedData();
