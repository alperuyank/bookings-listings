const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authenticate = require("../middleware/authMiddleware");

// Route: Report Listings with Filters (Admin)
router.get(
  "/listings",
  authenticate.authMiddleware,
  adminController.reviewReports
);

module.exports = router;
