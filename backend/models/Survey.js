const mongoose = require("mongoose");

const surveySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One survey per user
    },

    // Q1 — What is your gender?
    gender: {
      type: String,
      enum: ["Male", "Female", "Non-binary", "Prefer not to say"],
      required: true,
    },

    // Q2 — How old are you?
    age: {
      type: Number,
      required: true,
      min: 10,
      max: 120,
    },

    // Q3 — Have you frequently felt sad or lost interest recently?
    feelsSadOrLostInterest: {
      type: Boolean,
      required: true,
    },

    // Q4 — Do you often feel excessively anxious or worried?
    feelsAnxious: {
      type: Boolean,
      required: true,
    },

    // Q5 — Have you ever experienced a panic attack?
    experiencedPanicAttack: {
      type: Boolean,
      required: true,
    },

    // Q6 — Have you ever consulted a mental health professional?
    consultedProfessional: {
      type: Boolean,
      required: true,
    },

    // Q7 — How are you feeling today? (free text)
    feelingToday: {
      type: String,
      required: true,
      maxlength: 1000,
    },

    // Q8 — What is your current employment/study status?
    currentStatus: {
      type: String,
      enum: ["Student", "Employed", "Unemployed", "Other"],
      required: true,
    },

    // Q9 — Does your work or study frequently affect your mental health? (1-5)
    workAffectsMentalHealth: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // Q10 — Have you ever experienced prolonged sadness or depression?
    experiencedDepression: {
      type: Boolean,
      required: true,
    },

    // Q11 — Do you feel your current environment is supportive of your mental health?
    supportiveEnvironment: {
      type: Boolean,
      required: true,
    },

    // Q12 — What do you hope to achieve using MindMate? (multiple choice)
    expectations: {
      type: [String],
      enum: [
        "Venting",
        "Stress Relief",
        "Tracking Mood",
        "Self-Improvement",
        "Finding Calm",
        "Professional Guidance",
        "Other",
      ],
      required: true,
    },

    // Q13 — Do you experience difficulty sleeping?
    difficultySleeping: {
      type: Boolean,
      required: true,
    },

    // Q14 — How often do you have trouble concentrating? (1-5)
    troubleConcentrating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // Q15 — Do you have someone to talk to when you face problems?
    hasSupportPerson: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Survey", surveySchema);
