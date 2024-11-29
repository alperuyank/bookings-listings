const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const listingRoutes = require("./routes/listingRoutes");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/adminRoutes");
const setupSwagger = require("./routes/swaggerRoutes");

const app = express();
setupSwagger(app);

app.use(cors({
  origin: "http://example.com",          // Sadece belirli domainlere izin ver
  methods: ["GET", "POST", "PUT", "DELETE"],  // Hangi HTTP metodlarına izin verileceğini belirt
  allowedHeaders: ["Content-Type", "Authorization"],  // Hangi başlıklar kabul edilecek
}));

// Veritabanı Bağlantısı
connectDB();

// Middleware
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`
          <div class="container" style="display:flex; justify-content:center; align-items:center; height:100vh;">
            <p style="font-size:36px;">Go to 
              <a href="/api-docs">API Documentation</a>
            </p>
          </div>
            `);
});

// Routes for v1
app.use("/api/v1/listings", listingRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/admin/reports", adminRoutes);

// Sunucuyu Dinle
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}/api-docs/`);
});
