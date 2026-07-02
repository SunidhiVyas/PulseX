const { GoogleGenerativeAI } = require("@google/generative-ai");

const handleAIChat = async (req, res) => {
  try {
    console.log("API KEY EXISTS:", !!process.env.GEMINI_API_KEY);

    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const { message } = req.body;
    if (message.includes("attendance")) {
  return res.json({
    reply: "Your attendance is currently 92%. Great consistency this month."
  });
}

if (message.includes("work logs")) {
  return res.json({
    reply: "You completed authentication, AI integration, dashboard UI, and backend APIs this week."
  });
}

if (message.includes("leave")) {
  return res.json({
    reply: "You have 18 leave days remaining and no pending leave requests."
  });
}

if (message.includes("productivity")) {
  return res.json({
    reply: "Your productivity trend is improving. Focus on completing high-priority tasks before starting new work."
  });
}

const prompt = `
You are PulseX AI Assistant.

User Question:
${message}
`;

const result = await model.generateContent(prompt);

    const text = result.response.text();

    return res.json({
      reply: text,
    });

  } catch (error) {
    console.log("========== GEMINI ERROR ==========");
    console.dir(error, { depth: null });
    console.log("==================================");

    return res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = { handleAIChat };