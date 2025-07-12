const express = require("express");
const router = express.Router();
const { saveScore, getScores } = require("../controllers/scoreController");
const { protectUser } = require("../middleware/authMiddleware");

router.post("/",protectUser, saveScore);
router.get("/leaderboard", getScores);

module.exports = router;
