const Message = require("../models/Message");

// Helper function to call Google AI Studio (Gemini)
const callGoogleAI = async (messages) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY is missing from .env");
  }

  const model = "gemini-2.5-flash"; // Free, fast Gemini model

  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Google AI Studio Error:", errorText);
    throw new Error(`Google AI Studio API responded with status ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

/**
 * @route   GET /api/chat
 * @desc    Get all chat history for the logged-in user
 * @access  Private
 */
const getChatHistory = async (req, res) => {
  try {
    const messages = await Message.find({ user: req.user._id }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    console.error("Get chat history error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * @route   POST /api/chat
 * @desc    Send a message to the AI and get a response
 * @access  Private
 */
const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Message content is required" });
    }

    // 1. Save user's message to DB
    const userMessage = new Message({
      user: req.user._id,
      role: "user",
      content: content,
    });
    await userMessage.save();

    // 2. Fetch recent chat history to provide context to the AI (last 10 messages to save tokens)
    const recentMessages = await Message.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Reverse them back to chronological order for the API
    recentMessages.reverse();

    // 3. Format messages for Google AI Studio (Gemini) API
    const systemPrompt = {
      role: "system",
      content: "You are MindMate AI, an empathetic, non-judgmental, and supportive digital mental health companion. Your goal is to listen, validate feelings, and gently guide users towards calmness using simple grounding techniques when they are anxious or overwhelmed. Keep your responses relatively concise (1-3 short paragraphs maximum). Ask open-ended questions to encourage them to share. Do not diagnose medical conditions."
    };

    const apiMessages = [
      systemPrompt,
      ...recentMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    // 4. Call Google AI Studio (Gemini)
    const aiResponseText = await callGoogleAI(apiMessages);

    // 5. Save AI's response to DB
    const aiMessage = new Message({
      user: req.user._id,
      role: "assistant",
      content: aiResponseText,
    });
    await aiMessage.save();

    // 6. Return both messages to the frontend
    res.json({ userMessage, aiMessage });

  } catch (error) {
    console.error("Send message error:", error.message);
    res.status(500).json({ message: "Failed to communicate with AI." });
  }
};

module.exports = {
  getChatHistory,
  sendMessage,
};
