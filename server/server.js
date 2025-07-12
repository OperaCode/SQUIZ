require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const connectDb = require("./config/db");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
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
//   "https://pay-wise-ecru.vercel.app"
];


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


// Session setup
app.use(session({
  secret: "quizAppSecret",
  resave: false,
  saveUninitialized: true,
}));


app.use(passport.initialize());
app.use(passport.session());

// Passport serialize/deserialize
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Google Strategy setup
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
},
async (accessToken, refreshToken, profile, done) => {
  // Here, create user in DB if not exists
  const user = {
    googleId: profile.id,
    name: profile.displayName,
    email: profile.emails[0].value,
    avatar: profile.photos[0].value,
  };

  // TODO: Check in DB, create user if not exists
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      user = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value,
      });
    }

    return done(null, user);
  } catch (err) {
    console.error(err);
    return done(err, null);
  }
}
  return done(null, user);
}
));

// Routes

// Initiate login
app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback route
app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful login
    const user = req.user;

    // Generate app JWT token
    const token = jwt.sign({
      id: user.googleId,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Redirect to frontend with token as query param
    res.redirect(`http://localhost:5173?token=${token}`);
  }
);



// Routes
app.use("/user", require("./routes/userRoutes"));
app.use("/score", require("./routes/scoreRoutes"));




//Start server after DB is ready
mongoose.connection.once("open", () => {
  console.log("Connected to Database");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
