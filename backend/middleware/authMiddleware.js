const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Protect routes — verifies JWT from Authorization header.
 * Attaches the authenticated user document to `req.user`.
 *
 * Usage: router.get("/profile", protect, controller)
 */
const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract the token (format: "Bearer <token>")
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using the same secret used to sign it
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (exclude password from the result)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User no longer exists" });
      }

      next();
    } catch (error) {
      console.error("Auth middleware error:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

module.exports = { protect };
