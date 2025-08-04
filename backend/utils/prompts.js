const questionAnswerPrompt = (
  role,
  experience,
  topicsToFocus,
  numberOfQuestions
) => `
You are an AI trained to generate technical interview questions and answers.

Task:
- Role: ${role}
- Candidate Experience: ${experience} years
- Focus Topics: ${topicsToFocus}
- Write ${numberOfQuestions} interview questions.
- For each question, generate a detailed but beginner-friendly answer.
- If the answer needs a code example, include a small code block inside.
- Keep formatting very clean and simple.
- Do NOT include markdown syntax like \`\`\`json or \`\`\`.
- Do NOT include any extra explanation or text before or after the JSON.
- Output ONLY a valid JSON array in the following format:

[
  {
    "question": "Question here?",
    "answer": "Answer here."
  },
  ...
]
`;

const conceptExplainPrompt = (question) => `
You are an AI trained to generate explanations for a given interview question.

Task:
- Explain the following interview question and its concept in depth as if you're teaching a beginner developer.
- Question: "${question}"
- After the explanation, provide a short and clear title that summarizes the concept for a page header.
- If the explanation includes a code example, include a small code block.
- Keep formatting very clean and clear.
- Do NOT wrap the output in triple backticks.
- Do NOT include any text or explanation outside of the JSON.
- Output ONLY a valid JSON object in the following format:

{
  "title": "Short title here",
  "explanation": "Explanation here."
}
`;

module.exports = { questionAnswerPrompt, conceptExplainPrompt };
