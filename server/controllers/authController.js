const jwt = require("jsonwebtoken");

BASE_URL=process.env.FRONTEND_URL;


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

  res.redirect(`${BASE_URL}?token=${token}`);
};

module.exports = { generateTokenAndRedirect };
