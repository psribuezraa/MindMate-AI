const express = require("express");
const router = express.Router();
const { getChatHistory, sendMessage, generateDailyTasks } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

router.route("/")
  .get(protect, getChatHistory)
  .post(protect, sendMessage);

router.get("/daily-tasks", protect, generateDailyTasks);

module.exports = router;
