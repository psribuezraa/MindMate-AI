import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, Mic, Send, Loader } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  /* Auto-scroll to newest message */
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  /* Fetch chat history on mount */
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(`${API_URL}/api/chat`, config);
        
        if (res.data && res.data.length > 0) {
          // Map backend _id to id for React keys
          const mappedHistory = res.data.map(m => ({ ...m, id: m._id }));
          setMessages(mappedHistory);
        } else {
          setMessages([INITIAL_MESSAGE]);
        }
      } catch (err) {
        console.error('Failed to load chat history', err);
        setMessages([INITIAL_MESSAGE]);
      } finally {
        setIsLoading(false);
        // Focus input after loading
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    };

    if (token) {
      fetchHistory();
    }
  }, [token]);

  /* ── Send a message ── */
  const sendMessage = useCallback(
    async (text) => {
      const trimmed = (text || input).trim();
      if (!trimmed) return;

      const tempId = Date.now().toString();
      const userMsg = {
        id: tempId,
        role: 'user',
        content: trimmed,
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setIsTyping(true);

      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.post(`${API_URL}/api/chat`, { content: trimmed }, config);
        
        // Update messages with the real IDs from the backend and the AI's response
        setMessages((prev) => {
          // Replace temp user message with real one
          const updated = prev.map(m => m.id === tempId ? { ...res.data.userMessage, id: res.data.userMessage._id } : m);
          // Append AI message
          return [...updated, { ...res.data.aiMessage, id: res.data.aiMessage._id }];
        });
      } catch (err) {
        console.error('Failed to send message', err);
        // Add an error message
        setMessages((prev) => [
          ...prev, 
          { id: Date.now().toString(), role: 'assistant', content: 'I am having trouble connecting right now. Please try again in a moment.' }
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [input, token],
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
  const showQuickPrompts = messages.length === 1 && messages[0].id === 'welcome';

  if (isLoading) {
    return (
      <div className="chat-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader className="spin" size={32} color="var(--color-accent-sage)" />
      </div>
    );
  }

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


