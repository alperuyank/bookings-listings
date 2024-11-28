const express = require('express');
const connectDB = require('./config/db');
const listingRoutes = require('./routes/listingRoutes');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');
const setupSwagger = require('./routes/swaggerRoutes');

const app = express();
setupSwagger(app);

// Veritabanı Bağlantısı
connectDB();

// Middleware
app.use(express.json());

// Routes for v1
app.use('/api/v1/listings', listingRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/admin/reports', adminRoutes);

// Sunucuyu Dinle
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}/api-docs/`);
});
