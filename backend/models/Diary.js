const mongoose = require('mongoose');

const diarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  mood: {
    type: String, // e.g., 'Happy', 'Sad', 'Anxious', 'Neutral'
    required: true,
  },
  // Data for AI Analysis / Visualisasi Mood Analytics Widget
  aiAnalysis: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('Diary', diarySchema);
