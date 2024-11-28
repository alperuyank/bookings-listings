const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  country: { type: String, required: true },
  city: { type: String, required: true },
  noOfPeople: { type: Number, required: true },
  price: { type: Number, required: true },
  availability: [{ from: Date, to: Date }],
  booked: { type: Boolean, default: false },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Listing", listingSchema);
