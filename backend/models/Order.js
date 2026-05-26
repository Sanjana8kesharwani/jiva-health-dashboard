import mongoose from 'mongoose';

// Define the Order Item Schema
const orderItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
});

// Define the Shipping Address Schema inside Order
const shippingAddressSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Home', 'Work'],
    default: 'Home',
  },
  addressLine: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Order must belong to a user'],
    },
    orderItems: {
      type: [orderItemSchema],
      required: [true, 'Order must have at least one item'],
      validate: {
        validator: function (items) {
          return items && items.length > 0;
        },
        message: 'Order must contain at least one item',
      },
    },
    totalAmount: {
      type: Number,
      required: [true, 'Order total amount is required'],
      min: [0, 'Total amount cannot be negative'],
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
      default: 'Pending',
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    shippingAddress: {
      type: shippingAddressSchema,
      required: [true, 'Shipping address is required'],
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to update user's totalSpent and totalOrders after order completion
orderSchema.post('save', async function (doc) {
  if (doc.paymentStatus === 'Completed' || doc.orderStatus === 'Delivered') {
    try {
      const User = mongoose.model('User');
      const orders = await mongoose.model('Order').find({
        userId: doc.userId,
        paymentStatus: 'Completed',
      });
      const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
      
      await User.findByIdAndUpdate(doc.userId, {
        totalOrders: orders.length,
        totalSpent: totalSpent,
      });
    } catch (error) {
      console.error(`Error updating user stats on order save: ${error.message}`);
    }
  }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
export { orderItemSchema, shippingAddressSchema };
