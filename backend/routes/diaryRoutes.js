const express = require("express");
const router = express.Router();
const { createEntry, getEntries, deleteEntry } = require("../controllers/diaryController");
const { protect } = require("../middleware/authMiddleware");

// All diary routes require authentication
router.post("/", protect, createEntry);
router.get("/", protect, getEntries);
router.delete("/:id", protect, deleteEntry);

module.exports = router;
