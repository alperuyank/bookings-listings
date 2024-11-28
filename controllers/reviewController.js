const Review = require("../models/reviews");
const Booking = require("../models/bookings");

// Review a Stay
const reviewStay = async (req, res) => {
  const { bookingId, rating, comment } = req.body;

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking || booking.guestId.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You can only review your own bookings",
        status: 403,
      });
    }

    const existingReview = await Review.findOne({
      bookingId,
      userId: req.user.userId,
    });
    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this stay",
        status: 400,
      });
    }

    const review = new Review({
      bookingId,
      userId: req.user.userId,
      listingId: booking.listingId,
      rating,
      comment,
    });

    await review.save();

    await Booking.findByIdAndUpdate(
      req.user.userId,
      {
        $push: {
          bookings: review._id,
        },
      },
      {
        new: true,
      }
    );

    if (booking.status === "done") {
      res.status(201).json({
        message: "Review added successfully",
        review,
        status: 201,
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
      status: 500,
    });
  }
};

module.exports = {
  reviewStay,
};
