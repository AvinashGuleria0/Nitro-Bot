const Groq = require("groq-sdk");
const {
  conceptExplainPrompt,
  questionAnswerPrompt,
} = require("../../backend/utils/prompts");

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;
    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = questionAnswerPrompt(
      role,
      experience,
      topicsToFocus,
      numberOfQuestions
    );

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2048,
    });

    const rawText = response.choices[0].message.content;

    const cleanedText = rawText
      .replace(/^\s*```json\s*/, "")
      .replace(/```$/, "")
      .trim();

    const data = JSON.parse(cleanedText);

    res.status(200).json(data);
  } catch (error) {
    console.error("GENERATION ERROR:", error);
    res.status(500).json({
      message: "Failed to generate questions",
      error: error.message,
    });
  }
};

const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    const prompt = `Provide the explanation as valid JSON like this:\n\`\`\`json\n{\n  "explanation": "Your answer here"\n}\n\`\`\`\n\nQuestion: ${question}`;

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const rawText = response.choices[0].message.content;

    console.log("RAW:", rawText);

    const cleanedText = rawText
      .replace(/```json\s*/i, "")
      .replace(/```/g, "")
      .trim();


    const data = JSON.parse(cleanedText);

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to generate explanation",
      error: error.message,
    });
  }
};

const evaluateLiveAnswer = async (req, res) => {
  try {
    const { question, userAnswer, persona } = req.body;
    if (!question || !userAnswer) {
      return res.status(400).json({ message: "Question and userAnswer are required" });
    }

    const personaInstruction = persona === "strict" 
      ? "You are a strict technical interviewer. Your feedback should be direct, challenging, and focus heavily on edge cases."
      : persona === "friendly"
      ? "You are a friendly HR recruiter. Your feedback should be encouraging, warm, and focus on communication style."
      : "You are a balanced professional interviewer. Provide constructive, balanced feedback.";

    const prompt = `
      ${personaInstruction}
      Evaluate the following answer to the interview question.
      Question: "${question}"
      User's Answer: "${userAnswer}"

      Provide your evaluation strictly as a valid JSON object matching the following structure exactly:
      {
        "spokenFeedback": "A short, conversational sentence (max 2 sentences) responding to the candidate's answer and guiding them to the next step. This will be spoken via TTS.",
        "evaluation": {
          "score": 8, // A number between 1 and 10
          "confidenceScore": 85, // A number between 0 and 100 based on tone/hesitation
          "sentiment": "Short description of the user's sentiment (e.g. 'Assertive and clear', 'Hesitant')",
          "industryStandardAnswer": "A detailed example of how a senior industry professional would answer this.",
          "keyDifferences": ["Difference 1", "Difference 2"] // Array of strings pointing out what the user missed compared to the industry standard
        }
      }
    `;

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const rawText = response.choices[0].message.content;
    const cleanedText = rawText
      .replace(/```json\s*/i, "")
      .replace(/```/g, "")
      .trim();

    const data = JSON.parse(cleanedText);
    res.status(200).json(data);
  } catch (error) {
    console.error("EVALUATION ERROR:", error);
    res.status(500).json({
      message: "Failed to evaluate answer",
      error: error.message,
    });
  }
};

module.exports = { generateInterviewQuestions, generateConceptExplanation, evaluateLiveAnswer };
