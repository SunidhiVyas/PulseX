const handleAIChat = async (req, res) => {
  console.log("AI ROUTE HIT");

  return res.status(200).json({
    reply: "Hello Sunidhi! AI is working successfully 🚀"
  });
};

module.exports = { handleAIChat };