const Message = require("../models/Message");
const Diary = require("../models/Diary");
const Survey = require("../models/Survey");
const { summarizeSurveyForAI } = require("./surveyController");

// Helper function to call Groq API (Llama 3.3 70B)
const callGroqAI = async (messages) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is missing from .env");
  }

  const model = "llama-3.3-70b-versatile"; // Meta's state-of-the-art Llama 3.3 70B on Groq

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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
    console.error("Groq API Error:", errorText);
    throw new Error(`Groq API responded with status ${response.status}`);
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

    // 3. Fetch user's survey data for personalization (Emotional Resonance)
    const survey = await Survey.findOne({ user: req.user._id });
    const surveyContext = summarizeSurveyForAI(survey);

    // 4. Build dynamic system prompt with survey personalization
    let systemContent = "You are MindMate AI, an empathetic, non-judgmental, and supportive digital mental health companion. Your goal is to listen, validate feelings, and gently guide users towards calmness using simple grounding techniques when they are anxious or overwhelmed. Keep your responses relatively concise (1-3 short paragraphs maximum). Ask open-ended questions to encourage them to share. Do not diagnose medical conditions. CRITICAL RULE: You are strictly a mental health companion. If the user asks questions entirely unrelated to mental health, emotional well-being, psychology, or personal development (such as coding, IT, math, politics, or general trivia), you MUST politely decline to answer. Gently remind them of your purpose and redirect the conversation back to how they are feeling today.";

    if (surveyContext) {
      systemContent += `\n\nHere is important context about the user you are speaking with: ${surveyContext} Use this information to personalize your responses — be empathetic and tailor your tone and suggestions accordingly, but do not explicitly repeat this information back to the user unless they bring it up.`;
    }

    const systemPrompt = {
      role: "system",
      content: systemContent,
    };

    const apiMessages = [
      systemPrompt,
      ...recentMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    // 4. Call Groq API (Llama 3.3 70B)
    const aiResponseText = await callGroqAI(apiMessages);

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

/**
 * @route   GET /api/chat/daily-tasks
 * @desc    Generate 3 personalized daily wellness tasks using Groq AI
 * @access  Private
 */
const generateDailyTasks = async (req, res) => {
  try {
    // 1. Gather context: recent diary entries (last 3 days)
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const recentDiaries = await Diary.find({
      user: req.user._id,
      createdAt: { $gte: threeDaysAgo },
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("content mood createdAt");

    // 2. Gather context: survey data
    const survey = await Survey.findOne({ user: req.user._id });
    const surveyContext = summarizeSurveyForAI(survey);

    // 3. Build diary context string
    let diaryContext = "";
    if (recentDiaries.length > 0) {
      diaryContext = "Here are the user's recent diary entries:\n";
      recentDiaries.forEach((entry) => {
        const date = entry.createdAt.toISOString().slice(0, 10);
        diaryContext += `- [${date}] Mood: ${entry.mood}. Entry: "${entry.content}"\n`;
      });
    } else {
      diaryContext =
        "The user has not written any diary entries yet. They are likely new to the app.";
    }

    // 4. Build the system prompt for task generation
    const systemPrompt = {
      role: "system",
      content: `You are MindMate AI's Daily Wellness Planner. Your job is to suggest exactly 3 small, achievable, and uplifting wellness tasks for the user to do today.

RULES:
- Each task must be short (under 15 words).
- Tasks should be practical and doable right now (e.g. drink water, take a walk, write in your journal).
- If the user has recent diary entries, tailor tasks to their recent mood and concerns.
- If the user has no diary entries or activity, suggest gentle introductory tasks to help them get started with the app (e.g. "Write your first journal entry", "Try the 5-minute grounding exercise", "Listen to a calming soundscape").
- Respond ONLY with a valid JSON array of exactly 3 strings. No markdown, no explanation, no code fences.
- Example response: ["Drink a glass of water", "Take a 10-minute walk outside", "Write down 3 things you are grateful for"]`,
    };

    const userPrompt = {
      role: "user",
      content: `${surveyContext ? `User profile: ${surveyContext}\n\n` : ""}${diaryContext}\n\nGenerate 3 daily wellness tasks for today.`,
    };

    // 5. Call Groq API
    const aiResponse = await callGroqAI([systemPrompt, userPrompt]);

    // 6. Parse the JSON array from AI response
    let tasks;
    try {
      // Strip any potential markdown code fences the AI might add
      const cleaned = aiResponse.replace(/```json\n?|\n?```/g, "").trim();
      tasks = JSON.parse(cleaned);

      // Validate it's an array of strings
      if (!Array.isArray(tasks) || tasks.some((t) => typeof t !== "string")) {
        throw new Error("Invalid format");
      }
    } catch (parseErr) {
      console.error("Failed to parse AI tasks response:", aiResponse);
      // Fallback tasks if AI response is malformed
      tasks = [
        "Take a few deep breaths and relax",
        "Write down how you're feeling today",
        "Listen to a calming soundscape for 5 minutes",
      ];
    }

    res.json({ tasks });
  } catch (error) {
    console.error("Generate daily tasks error:", error.message);
    res.status(500).json({ message: "Failed to generate daily tasks." });
  }
};

module.exports = {
  getChatHistory,
  sendMessage,
  generateDailyTasks,
};
