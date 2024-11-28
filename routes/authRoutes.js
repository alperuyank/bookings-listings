const express = require('express');
const router = express.Router();

const {
  register,
  login,
  getUserDetails
} = require('../controllers/authController');

// @route   PUT /api/users/:id
// @desc    Update a user
router.post('/register', register);

router.post('/login', login);

router.post('/:userId', getUserDetails);

module.exports = router;
