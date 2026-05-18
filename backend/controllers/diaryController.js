const Diary = require("../models/Diary");

/**
 * @route   POST /api/diary
 * @desc    Create a new diary entry
 * @access  Private
 */
const createEntry = async (req, res) => {
  try {
    const { content, mood } = req.body;

    if (!content || !mood) {
      return res.status(400).json({ message: "Content and mood are required" });
    }

    const entry = await Diary.create({
      user: req.user._id,
      content,
      mood,
    });

    res.status(201).json(entry);
  } catch (error) {
    console.error("Create diary entry error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @route   GET /api/diary
 * @desc    Get all diary entries for the logged-in user
 * @access  Private
 */
const getEntries = async (req, res) => {
  try {
    const entries = await Diary.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(entries);
  } catch (error) {
    console.error("Get diary entries error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @route   DELETE /api/diary/:id
 * @desc    Delete a diary entry (only if it belongs to the user)
 * @access  Private
 */
const deleteEntry = async (req, res) => {
  try {
    const entry = await Diary.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    // Ensure the entry belongs to the authenticated user
    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this entry" });
    }

    await entry.deleteOne();
    res.json({ message: "Entry deleted" });
  } catch (error) {
    console.error("Delete diary entry error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createEntry, getEntries, deleteEntry };
