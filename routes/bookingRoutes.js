const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware')

router.post('/book', authMiddleware.authMiddleware, bookingController.bookStay);
router.get('/book/:bookingId', authMiddleware.authMiddleware, bookingController.getBooking);
//router.post('/list', authMiddleware.authMiddleware, bookingController.createListing);

module.exports = router;
