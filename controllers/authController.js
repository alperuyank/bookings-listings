const User = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email, and password are required.",
      status: 400,
    });
  }

  try {
    if (role === "admin") {
      const loggedInUser = req.user;

      if (!loggedInUser || loggedInUser.role !== "admin") {
        return res.status(403).json({
          message: "Only admins can create admin accounts",
          status: 403,
        });
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      status: 201,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      status: 500,
    });
  }
};

// Login User
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required.",
      status: 400,
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({
        message: "User not found",
        status: 404,
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({
        message: "Invalid credentials",
        status: 401,
      });

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      token,
      message: "Login successful",
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      status: 500,
    });
  }
};

const getUserDetails = (req, res) => {
  const userId = req.params.userId;

  User.findOne({ _id: userId })
    .populate("listings")
    .populate("bookings")
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: "User not found",
          status: 404,
        });
      }
      res.status(200).json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        message: "An error occurred while fetching user details.",
        status: 500,
      });
    });
};

module.exports = {
  register,
  login,
  getUserDetails,
};
