const mongoose = require("mongoose");

const QA_Schema = new mongoose.Schema({
  question: { type: String, required: true },
  userAnswer: { type: String, required: true },
  aiCritique: { type: String },
  aiBetterAnswer: { type: String },
  score: { type: Number },
  audioUrl: { type: String }, // Optional, for future voice playback
});

const InterviewSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, required: true },
    durationConfig: { type: String, enum: ["5m", "10m", "Dynamic"], default: "Dynamic" },
    persona: { type: String, enum: ["Mentor", "Stress", "Lead"], default: "Mentor" },
    status: { type: String, enum: ["In-Progress", "Completed"], default: "In-Progress" },
    overallScore: { type: Number, default: 0 },
    confidenceAnalysis: { type: String }, // e.g. "Confident but hesitated on system design."
    qnaRecords: [QA_Schema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("InterviewSession", InterviewSessionSchema);
