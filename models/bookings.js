const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    guestId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
    from: { type: Date, required: true },
    to: { type: Date, required: true },
    namesOfPeople: { type: [String], required: true },
    status: { 
      type: String, 
      enum: ['booked', 'cancelled', 'done'], 
      default: 'booked' 
    },
    createdAt: { type: Date, default: Date.now },
});

// This method will update the `status` field based on the current date
bookingSchema.methods.updateStatus = function() {
    const today = new Date();
    if (this.status !== 'cancelled') {
        if (this.to < today) {
            this.status = 'done';  // Booking has ended
        } else {
            this.status = 'booked'; // Booking is ongoing
        }
    }
    return this.status;
};

// Model
module.exports = mongoose.model('Booking', bookingSchema);
