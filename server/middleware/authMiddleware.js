const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");

const protectUser = asyncHandler(async (req, res, next) => {
  let token;
  console.log("Request Cookies:", req.cookies);

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    console.error("No token found in request.");
    return res.status(401).json({ message: "Unauthorized, no token provided" });
  }

  try {
    console.log("🔹 Verifying token...");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded user:", decoded);

    const foundUser = await userModel.findById(decoded.id).select("-password");

    if (!foundUser) {
      console.warn("⚠️ User not found.");
      return res.status(401).json({ message: "Unauthorized, user not found" });
    }

    req.user = foundUser; 

    console.log("Authentication successful for user:", foundUser.email);
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = { protectUser };
