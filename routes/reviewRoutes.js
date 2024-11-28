const express = require('express');
const router = express.Router();
const reviewStay = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware')


router.post('/review', authMiddleware.authMiddleware, reviewStay.reviewStay);

module.exports = router;
