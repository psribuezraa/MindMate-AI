const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { submitSurvey, getMySurvey } = require("../controllers/surveyController");

// POST /api/survey — Submit onboarding survey
router.post("/", protect, submitSurvey);

// GET /api/survey/me — Get current user's survey data
router.get("/me", protect, getMySurvey);

module.exports = router;
