import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Payment must belong to a user'],
    },
    paymentId: {
      type: String,
      required: [true, 'Transaction payment ID is required'],
      unique: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    method: {
      type: String,
      required: [true, 'Payment method is required'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Pending',
    },
    transactionDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
