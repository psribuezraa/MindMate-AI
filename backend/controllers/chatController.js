const Message = require("../models/Message");

// Helper function to call OpenRouter
const callOpenRouter = async (messages) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is missing from .env");
  }

  // Using a free, fast model for the MVP. You can change this to "google/gemini-flash-1.5" or others later.
  const model = "meta-llama/llama-3-8b-instruct:free"; 

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": "http://localhost:5173", // Optional, for OpenRouter rankings
      "X-Title": "MindMate AI", // Optional, for OpenRouter rankings
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OpenRouter API Error:", errorText);
    throw new Error(`OpenRouter API responded with status ${response.status}`);
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

    // 3. Format messages for OpenRouter API
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

    // 4. Call OpenRouter
    const aiResponseText = await callOpenRouter(apiMessages);

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
