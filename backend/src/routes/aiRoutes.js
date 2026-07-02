const express = require("express");
const router = express.Router();
const { handleAIChat } = require("../controllers/chatController");

// POST /api/ai/chat
router.post("/chat", handleAIChat);

module.exports = router;
