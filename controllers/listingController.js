const Listing = require("../models/listings");
const User = require("../models/users");

// Insert Listing (Host)
const insertListing = async (req, res) => {
  const { title, description, country, city, noOfPeople, price, availability } =
    req.body;

  try {
    if (
      !req.user ||
      !req.user.role ||
      req.user.role !== "user"
    ) {
      return res.status(403).json({
        message: "Only users can add listings",
        status: 403,
      });
    }

    const newListing = new Listing({
      hostId: req.user.userId,
      title,
      description,
      country,
      city,
      noOfPeople,
      price,
      availability,
    });

    await newListing.save();

    await User.findByIdAndUpdate(
      req.user.userId,
      {
        $push: {
          listings: newListing._id,
        },
      },
      {
        new: true,
      }
    );

    res.status(201).json({
      message: "Listing created successfully",
      status: 201,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      status: 500,
    });
  }
};

// Query Listings (Guest)
const queryListings = async (req, res) => {
  const { date, from, to, noOfPeople, country, city } = req.query;

  try {
    const listings = await Listing.find({
      country,
      city,
      noOfPeople: {
        $gte: noOfPeople,
      },
      availability: {
        $not: {
          $elemMatch: {
            from: {
              $lte: new Date(to),
            },
            to: {
              $gte: new Date(from),
            },
          },
        },
      },
    });

    const availableListings = listings.filter((listing) => {
      return (
        !listing.booked ||
        !listing.booked.some((booking) => {
          return (
            new Date(booking.to) > new Date(from) &&
            new Date(booking.from) < new Date(to)
          );
        })
      );
    });

    res.json({ listings: availableListings });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      status: 500,
    });
  }
};

// Get all listings with pagination
const getAllListings = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = "price", order = "asc" } = req.query;

    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = order === "asc" ? 1 : -1;

    const listings = await Listing.find()
      .skip(skip)
      .limit(parseInt(limit))
      .populate("hostId", "name email phone")
      .sort(sortOptions); 

    const totalListings = await Listing.countDocuments();

    if (!listings.length) {
      return res.status(404).json({
        status: 404,
        message: "No listings found",
      });
    }

    res.status(200).json({
      status: 200,
      data: listings,
      pagination: {
        totalListings,
        totalPages: Math.ceil(totalListings / limit),
        currentPage: parseInt(page),
        perPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

module.exports = {
  insertListing,
  queryListings,
  getAllListings,
};
