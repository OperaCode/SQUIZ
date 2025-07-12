const jwt = require("jsonwebtoken");

const generateTokenAndRedirect = (req, res) => {
  const user = req.user;

  const token = jwt.sign(
    {
      id: user.googleId,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.redirect(`http://localhost:5173?token=${token}`);
};

module.exports = { generateTokenAndRedirect };
