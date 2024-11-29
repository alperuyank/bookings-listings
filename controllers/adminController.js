const Review = require("../models/reviews");

const reviewReports = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied",
        status: 403,
      });
    }

    const { country, city, rating, page = 1, limit = 10 } = req.query;

    let filter = {};

    if (country) {
      filter["country"] = country;
    }

    if (city) {
      filter["city"] = city;
    }

    // Aggregate the reviews and calculate the average rating per listing
    const aggregatePipeline = [
      {
        // Join the Review collection with Listing to get country and city info
        $lookup: {
          from: "listings", // The collection to join
          localField: "listingId", // Field from Review model
          foreignField: "_id", // Field from Listing model
          as: "listing", // Alias for the resulting array
        },
      },
      {
        // Flatten the array (listing) created by $lookup
        $unwind: "$listing",
      },
      {
        // Apply the filter for country, city, and rating
        $match: filter,
      },
      {
        // Calculate the average rating for each listing
        $group: {
          _id: "$listingId", // Group by listingId
          avgRating: { $avg: "$rating" }, // Calculate average rating
          listingDetails: { $first: "$listing" }, // Include details of the listing (e.g., country, city)
        },
      },
      {
        // If a rating is provided, filter the listings by average rating
        $match: {
          avgRating: { $gte: rating || 1 }, // Ensure average rating is greater than or equal to the specified rating
        },
      },
      {
        // Skip records to implement pagination
        $skip: (page - 1) * limit,
      },
      {
        // Limit the number of records per page
        $limit: parseInt(limit),
      },
    ];

    // Execute the aggregation pipeline to fetch the results
    const listings = await Review.aggregate(aggregatePipeline);

    // To calculate the total number of records without pagination
    const totalCount = await Review.aggregate(aggregatePipeline.slice(0, -3)); // Remove skip and limit for count

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalCount.length / limit);

    return res.status(200).json({
      page,
      totalPages,
      totalCount: totalCount.length,
      listings,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
      status: 403,
    });
  }
};

module.exports = {
  reviewReports,
};
