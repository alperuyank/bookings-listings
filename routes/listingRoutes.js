const express = require('express');
const router = express.Router();
const { queryListings, insertListing, getAllListings } = require('../controllers/listingController.js');
const auth = require('../middleware/authMiddleware')


// @route   POST /api/listings
// @desc    Insert a new listing
router.get('/list', getAllListings);// @route   POST /api/listings
// @desc    Insert a new listing
router.get('/list/:id', queryListings);



// @route   POST /api/listings
// @desc    Insert a new listing
router.post('/list', auth.authMiddleware, insertListing);


module.exports = router;
