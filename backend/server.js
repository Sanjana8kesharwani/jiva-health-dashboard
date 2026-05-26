import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Load Middlewares
import notFoundMiddleware from './middleware/notFoundMiddleware.js';
import errorMiddleware from './middleware/errorMiddleware.js';

// Load Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Standard middleware setup
app.use(cors());
app.use(express.json()); // Body parser

// ----------------------------------------------------
// Root & Health Check Endpoint
// ----------------------------------------------------
app.get('/', (req, res) => {
  res.status(200).send('Jiva Health Admin Dashboard API Server is running...');
});

app.get('/api/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Jiva Health API Connection Check Successful',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ----------------------------------------------------
// Mounting API Routes
// ----------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// ----------------------------------------------------
// Error Handling Middlewares
// ----------------------------------------------------
app.use(notFoundMiddleware);
app.use(errorMiddleware);

// Define PORT
const PORT = process.env.PORT || 5001;

// Start Server
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

export default app;
export { server };
