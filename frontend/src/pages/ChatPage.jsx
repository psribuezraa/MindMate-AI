import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, Mic, Send } from 'lucide-react';

const QUICK_PROMPTS = [
  "I'm anxious",
  'Need to vent',
  'Just checking in',
];

const INITIAL_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content:
    "I noticed you've had a busy week based on your previous check-ins. Take a deep breath. Let's start slow. What's on your mind right now?",
};

export default function ChatPage() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  /* Auto-scroll to newest message */
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  /* Focus input on mount */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /* ── Send a message ── */
  const sendMessage = useCallback(
    (text) => {
      const trimmed = (text || input).trim();
      if (!trimmed) return;

      const userMsg = {
        id: Date.now().toString(),
        role: 'user',
        content: trimmed,
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setIsTyping(true);

      // Simulate AI response (will be replaced with real API call later)
      setTimeout(() => {
        const aiMsg = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: getPlaceholderResponse(trimmed),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
      }, 1200 + Math.random() * 800);
    },
    [input],
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickPrompt = (prompt) => {
    sendMessage(prompt);
  };

  /* ── Only show quick-prompt chips when there is one message (the welcome) ── */
  const showQuickPrompts = messages.length === 1;

  return (
    <div className="chat-page" id="chat-page">
      {/* ── Header ── */}
      <div className="chat-header">
        <div className="chat-header-icon">
          <MessageCircle size={22} />
        </div>
        <h2 className="chat-header-title">MindMate AI Therapist</h2>
        <p className="chat-header-subtitle">
          This is your safe space. Take your time.
        </p>
      </div>

      {/* ── Messages ── */}
      <div className="chat-messages" id="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-bubble-row ${msg.role === 'user' ? 'user' : 'assistant'}`}
          >
            {msg.role === 'assistant' && (
              <div className="chat-avatar">
                <MessageCircle size={16} />
              </div>
            )}

            <div className="chat-bubble-wrapper">
              {msg.role === 'assistant' && (
                <span className="chat-sender-label">MINDMATE</span>
              )}
              <div className={`chat-bubble ${msg.role}`}>{msg.content}</div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="chat-bubble-row assistant">
            <div className="chat-avatar">
              <MessageCircle size={16} />
            </div>
            <div className="chat-bubble-wrapper">
              <span className="chat-sender-label">MINDMATE</span>
              <div className="chat-bubble assistant">
                <span className="typing-dots">
                  <span />
                  <span />
                  <span />
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Quick prompts ── */}
      {showQuickPrompts && (
        <div className="chat-quick-prompts">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              className="chat-quick-chip"
              onClick={() => handleQuickPrompt(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* ── Input bar ── */}
      <form className="chat-input-bar" onSubmit={handleSubmit} id="chat-input-form">
        <button type="button" className="chat-mic-btn" aria-label="Voice input">
          <Mic size={18} />
        </button>

        <input
          ref={inputRef}
          type="text"
          className="chat-input"
          placeholder="Type your heart out..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          id="chat-input"
        />

        <button
          type="submit"
          className="chat-send-btn"
          disabled={!input.trim()}
          aria-label="Send message"
          id="chat-send-btn"
        >
          <Send size={18} />
        </button>
      </form>

      {/* ── Disclaimer ── */}
      <p className="chat-disclaimer">
        MindMate AI can make mistakes. Consider verifying important information.
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Placeholder responses (will be replaced by real AI API)
   ───────────────────────────────────────────── */
function getPlaceholderResponse(userText) {
  const lower = userText.toLowerCase();

  if (lower.includes('anxious') || lower.includes('anxiety') || lower.includes('worried'))
    return "I hear you — anxiety can feel overwhelming. Let's try a grounding exercise. Can you name 5 things you can see around you right now?";

  if (lower.includes('vent') || lower.includes('frustrated') || lower.includes('angry'))
    return "I'm here to listen. Go ahead and share whatever is weighing on you. There's no judgement here, only understanding.";

  if (lower.includes('checking in') || lower.includes('okay') || lower.includes('fine'))
    return "That's great that you're checking in with yourself. Even small moments of self-reflection matter. How has your energy been today?";

  if (lower.includes('sad') || lower.includes('depressed') || lower.includes('down'))
    return "I'm sorry you're feeling this way. It takes courage to acknowledge these feelings. Would you like to talk about what's been bringing you down?";

  if (lower.includes('stress') || lower.includes('overwhelm') || lower.includes('busy'))
    return "It sounds like a lot is on your plate right now. Let's take a step back together. What feels most pressing to you at this moment?";

  if (lower.includes('sleep') || lower.includes('tired') || lower.includes('exhausted'))
    return "Rest is so important for your mental well-being. Have you been able to wind down before bed? I can suggest a calming breathing exercise if you'd like.";

  return "Thank you for sharing that with me. I want to make sure I understand — could you tell me a bit more about how that makes you feel?";
}
