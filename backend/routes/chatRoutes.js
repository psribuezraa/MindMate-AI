const express = require("express");
const router = express.Router();
const { getChatHistory, sendMessage } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

router.route("/")
  .get(protect, getChatHistory)
  .post(protect, sendMessage);

module.exports = router;
