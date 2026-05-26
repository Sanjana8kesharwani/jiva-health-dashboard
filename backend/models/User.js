import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// ----------------------------------------------------
// 1. Address Schema (Subdocument)
// ----------------------------------------------------
const addressSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Home', 'Work'],
      default: 'Home',
    },
    addressLine: {
      type: String,
      required: [true, 'Please add an address line'],
    },
    city: {
      type: String,
      required: [true, 'Please add a city'],
    },
    state: {
      type: String,
      required: [true, 'Please add a state'],
    },
    pincode: {
      type: String,
      required: [true, 'Please add a pincode'],
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ----------------------------------------------------
// 2. Family Member Schema (Subdocument)
// ----------------------------------------------------
const familyMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add family member name'],
    },
    relationship: {
      type: String,
      required: [true, 'Please add relationship type'],
    },
    dob: {
      type: Date,
    },
    phone: {
      type: String,
    },
  },
  { timestamps: true }
);

// ----------------------------------------------------
// 3. User Schema
// ----------------------------------------------------
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please add a full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email address'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email address',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number'],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default in queries
    },
    avatar: {
      type: String,
      default: '', // Will default to a standard placeholder or initials dynamically
    },
    role: {
      type: String,
      enum: ['Patient', 'Nurse', 'Admin'],
      default: 'Patient',
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    isPrime: {
      type: Boolean,
      default: false,
    },
    bloodGroup: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },
    dob: {
      type: Date,
    },
    joinedDate: {
      type: Date,
      default: Date.now,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    appointmentsCount: {
      type: Number,
      default: 0,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    addresses: [addressSchema],
    familyMembers: [familyMemberSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Encrypt password using bcrypt before saving user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare user typed password with hashed password in database
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
export { addressSchema, familyMemberSchema };
