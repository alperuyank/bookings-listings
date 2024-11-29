const Booking = require("../models/bookings");
const Listing = require("../models/listings");
const User = require("../models/users");

// Book a Stay (Guest)
const bookStay = async (req, res) => {
  const { listingId, from, to, namesOfPeople } = req.body;

  if (!listingId || !from || !to || !namesOfPeople) {
    return res.status(400).json({
      message:
        "Listing ID, from date, to date, and names of people are required.",
      status: 400,
    });
  }

  try {
    if (req.user.role !== "user") {
      return res.status(403).json({
        message: "Only users can book a stay",
        status: 403,
      });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
        status: 404,
      });
    }

    if (listing.booked) {
      return res.status(400).json({
        message: "This listing has already been booked",
        status: 400,
      });
    }

    const booking = new Booking({
      guestId: req.user.userId,
      listingId,
      from,
      to,
      namesOfPeople,
    });

    await booking.save();

    booking.updateStatus();
    await booking.save();

    await User.findByIdAndUpdate(
      req.user.userId,
      {
        $push: {
          bookings: booking._id,
        },
      },
      {
        new: true,
      }
    );

    listing.booked = true;
    listing.bookedBy = req.user.userId;

    // listing.availability = listing.availability.filter(
    //   (dateRange) => !(dateRange.from >= from && dateRange.to <= to) // Remove matching date range
    // );

    await listing.save();

    res.status(201).json({
      message: "Booking successful",
      status: 201,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      status: 500,
    });
  }
};

const getBooking = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const booking = await Booking.findById(bookingId)
      .populate("guestId", "name email")
      .populate("listingId", "title location price");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
        status: 404,
      });
    }

    if (
      booking.guestId._id.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "You do not have permission to view this booking",
        status: 403,
      });
    }

    booking.updateStatus();

    res.status(200).json({
      message: "Booking retrieved successfully",
      status: 200,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      status: 500,
    });
  }
};

module.exports = {
  bookStay,
  getBooking,
};
