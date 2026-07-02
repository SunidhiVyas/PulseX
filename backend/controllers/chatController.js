const handleAIChat = async (req, res) => {
  const { message } = req.body;

  return res.status(200).json({
    reply: `AI received: ${message}`
  });
};

module.exports = { handleAIChat };