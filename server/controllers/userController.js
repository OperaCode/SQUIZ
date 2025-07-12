const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Helper to generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
};

// Register
// const registerUser = async (req, res) => {
//   const { name, email, password } = req.body;

//   if (!name || !email || !password)
//     return res.status(400).json({ message: "All fields required" });

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser)
//       return res.status(400).json({ message: "Email already in use" });

//     const salt = await bcrypt.genSalt(10);
//     const hashed = await bcrypt.hash(password, salt);

//     const user = await User.create({ name, email, password: hashed });

//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       token: generateToken(user._id),
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// Login
// const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password)
//     return res.status(400).json({ message: "All fields required" });

//   try {
//     const user = await User.findOne({ email });
//     if (!user)
//       return res.status(400).json({ message: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.status(400).json({ message: "Invalid credentials" });

//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       token: generateToken(user._id),
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("Incoming request body:", req.body);

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 8 || password.length > 12) {
      return res
        .status(400)
        .json({ message: "Password must be between 8 and 12 characters" });
    }

    const userExist = await User.findOne({ email });
    console.log("Existing user check result:", userExist);

    if (userExist) {
      return res
        .status(400)
        .json({ message: "User already exists. Please log in." });
    }

    const newUser = await User.create({
      name,
      email,
      password,
    });

    await newUser.save();
    const token = generateToken(newUser._id);

    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 86400000),
      sameSite: "none",
      secure: true,
    });

    console.log("User registered successfully:", newUser.email);

    res.status(201).json({
      message: `Registration Successful! A verification email has been sent.`,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User Not Found!" });
    }
    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = generateToken(user._id);
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // Expires in 24 hours
      sameSite: "none",
      secure: true,
    });

    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        
      },
    });

    console.log(user);
  } catch (error) {
    console.log("Login Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { registerUser, loginUser };
