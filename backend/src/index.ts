import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import catalogRoutes from './routes/catalog';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/orders';
import paymentRoutes from './routes/payments';
import contentRoutes from './routes/content';
import adminRoutes from './routes/adminRoutes';

import { stripeWebhook } from './controllers/orderController';

const app = express();
const port = process.env.PORT || 5000;

// Set FRONTEND_URL in your cloud provider's environment variables
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    
    if (origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }
    
    // Otherwise fallback to false
    callback(null, false);
  },
  credentials: true
}));

// Stripe Webhook needs raw body
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running smoothly.' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
