const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Initiate login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Callback route
router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const user = req.user;

    const token = jwt.sign({
      id: user.googleId,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.redirect(`http://localhost:5173?token=${token}`);
  }
);

module.exports = router;
