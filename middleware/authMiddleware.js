const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  console.log("AuthMiddleware working");

  const token = req.headers["authorization"]?.split(" ")[1];
  console.log("token",token);
  if (!token)
    return res.status(403).json({
      message: "No token provided",
      status: 403,
    });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // Token'den gelen userId ve role bilgilerini al
    next();
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized",
      status: 401,
      err: error
    });
  }
};

module.exports = {
  authMiddleware,
};
