const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    role: { type: String },
    experience: { type: Number },
    topicsToFocus: [{ type: String }],
    description: { type: String },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    attempts: [{
      createdAt: { type: Date, default: Date.now },
      persona: { type: String },
      duration: { type: String },
      avgScore: { type: Number },
      avgConfidence: { type: Number },
      history: [{
        question: String,
        userAnswer: String,
        spokenFeedback: String,
        evaluation: {
          score: Number,
          confidenceScore: Number,
          sentiment: String,
          industryStandardAnswer: String,
          keyDifferences: [String]
        }
      }]
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", SessionSchema);
