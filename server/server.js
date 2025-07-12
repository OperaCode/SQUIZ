require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const connectDb = require("./config/db");
const session = require("express-session");
const passport = require("passport");

const jwt = require("jsonwebtoken");




const app = express();
const PORT = process.env.PORT || 3000;

//Connect DB 
connectDb();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const cors = require("cors");
const allowedOrigins = [
  "http://localhost:5173",
  "https://squiz-gamma.vercel.app/"
];


app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));


require("./config/passportConfig");
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/user", require("./routes/userRoutes"));
app.use("/score", require("./routes/scoreRoutes"));


// Consolelogs- FOR TEST
// app.get("/auth/google", (req, res, next) => {
//   console.log("HIT /auth/google route");
//   next();
// }, passport.authenticate("google", { scope: ["profile", "email"] }));



//Start server after DB is ready
mongoose.connection.once("open", () => {
  console.log("Connected to Database");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
