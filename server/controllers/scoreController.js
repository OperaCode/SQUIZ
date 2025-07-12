const Score = require('../models/scoreModel');

// Save score
const saveScore = async (req, res) => {
  const { score } = req.body;
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const newScore = new Score({
      user: req.user._id, // ✅ fixed here
      name: req.user.name,
      score,
    });
    console.log(newScore)

    await newScore.save();
    res.status(201).json(newScore);
  } catch (err) {
    console.error("Error saving score:", err);
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
