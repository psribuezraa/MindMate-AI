const Survey = require("../models/Survey");
const User = require("../models/User");

/**
 * @route   POST /api/survey
 * @desc    Submit onboarding survey answers
 * @access  Private
 */
const submitSurvey = async (req, res) => {
  try {
    // Check if user already submitted a survey
    const existingSurvey = await Survey.findOne({ user: req.user._id });
    if (existingSurvey) {
      return res.status(400).json({ message: "Survey already completed" });
    }

    const {
      gender,
      age,
      feelsSadOrLostInterest,
      feelsAnxious,
      experiencedPanicAttack,
      consultedProfessional,
      feelingToday,
      currentStatus,
      workAffectsMentalHealth,
      experiencedDepression,
      supportiveEnvironment,
      expectations,
      difficultySleeping,
      troubleConcentrating,
      hasSupportPerson,
    } = req.body;

    // Create the survey document
    const survey = await Survey.create({
      user: req.user._id,
      gender,
      age,
      feelsSadOrLostInterest,
      feelsAnxious,
      experiencedPanicAttack,
      consultedProfessional,
      feelingToday,
      currentStatus,
      workAffectsMentalHealth,
      experiencedDepression,
      supportiveEnvironment,
      expectations,
      difficultySleeping,
      troubleConcentrating,
      hasSupportPerson,
    });

    // Mark user as having completed the survey
    await User.findByIdAndUpdate(req.user._id, {
      hasCompletedSurvey: true,
    });

    res.status(201).json({
      message: "Survey submitted successfully",
      survey,
    });
  } catch (error) {
    console.error("Submit survey error:", error.message);

    // Handle Mongoose validation errors nicely
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }

    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @route   GET /api/survey/me
 * @desc    Get the logged-in user's survey data
 * @access  Private
 */
const getMySurvey = async (req, res) => {
  try {
    const survey = await Survey.findOne({ user: req.user._id });

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    res.json(survey);
  } catch (error) {
    console.error("Get survey error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Helper — Summarize survey data into a natural-language context paragraph
 * for injection into the AI system prompt.
 */
const summarizeSurveyForAI = (survey) => {
  if (!survey) return "";

  const parts = [];

  // Demographics
  parts.push(
    `The user is a ${survey.age}-year-old ${survey.gender.toLowerCase()} who is currently ${survey.currentStatus === "Other" ? "in an unspecified situation" : survey.currentStatus === "Student" ? "a student" : survey.currentStatus.toLowerCase()}.`
  );

  // Mental state flags
  const mentalFlags = [];
  if (survey.feelsSadOrLostInterest)
    mentalFlags.push("has recently felt sad or lost interest in things");
  if (survey.feelsAnxious)
    mentalFlags.push("frequently feels anxious or excessively worried");
  if (survey.experiencedPanicAttack)
    mentalFlags.push("has experienced panic attacks");
  if (survey.experiencedDepression)
    mentalFlags.push("has experienced prolonged sadness or depression");
  if (survey.difficultySleeping)
    mentalFlags.push("has difficulty sleeping");

  if (mentalFlags.length > 0) {
    parts.push(`They ${mentalFlags.join(", and ")}.`);
  } else {
    parts.push(
      "They have not reported significant mental health concerns in their initial assessment."
    );
  }

  // Work/study impact
  if (survey.workAffectsMentalHealth >= 4) {
    parts.push(
      "Their work or studies significantly affect their mental health."
    );
  } else if (survey.workAffectsMentalHealth >= 3) {
    parts.push(
      "Their work or studies moderately affect their mental health."
    );
  }

  // Concentration
  if (survey.troubleConcentrating >= 4) {
    parts.push("They frequently have trouble concentrating.");
  } else if (survey.troubleConcentrating >= 3) {
    parts.push("They sometimes have trouble concentrating.");
  }

  // Support system
  if (!survey.hasSupportPerson) {
    parts.push(
      "They do not have someone to talk to when facing problems, so your support is especially important."
    );
  }

  if (!survey.supportiveEnvironment) {
    parts.push(
      "They feel their current environment is not supportive of their mental health."
    );
  }

  // Professional help
  if (survey.consultedProfessional) {
    parts.push(
      "They have previously consulted a mental health professional."
    );
  }

  // Expectations
  if (survey.expectations && survey.expectations.length > 0) {
    parts.push(
      `They hope to use MindMate for: ${survey.expectations.join(", ").toLowerCase()}.`
    );
  }

  // Current feeling
  if (survey.feelingToday) {
    parts.push(
      `When they first joined, they described their feelings as: "${survey.feelingToday}".`
    );
  }

  return parts.join(" ");
};

module.exports = { submitSurvey, getMySurvey, summarizeSurveyForAI };
