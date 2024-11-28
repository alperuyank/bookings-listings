const mongoose = require('mongoose');

const adminReportSchema = new mongoose.Schema({
    country: { type: String, required: true },
    city: { type: String, required: true },
    listings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
    generatedAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('AdminReport', adminReportSchema);
  