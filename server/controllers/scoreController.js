const Score = require('../models/scoreModel');

// Save score
const saveScore = async (req, res) => {
  const { score } = req.body;
  try {
    const newScore = new Score({
      user: req.user._id, // store user ID for reference
      name: req.user.name, // take name from authenticated user
      score,
    });
    await newScore.save();
    res.status(201).json(newScore);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get leaderboard
const getScores = async (req, res) => {
  try {
    const scores = await Score.find()
      .sort({ score: -1 })
      .limit(20)
      .populate('user', 'name');

    res.json(scores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



module.exports = { saveScore, getScores };
