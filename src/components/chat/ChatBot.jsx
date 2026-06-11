// src/components/chat/ChatBot.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// -------------------------------------------------------------------
// Local hook: reduced‑motion preference
// (Can be extracted to a shared utility later.)
// -------------------------------------------------------------------
function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefers(mq.matches);
    const handler = (e) => setPrefers(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return prefers;
}

// ----------------------------- Knowledge Base ---------------------------------
const knowledgeBase = {
  // ... (unchanged – omitted for brevity in report, but present in full file)
};

// Helper: detect intent from user message and current page
function detectIntent(message, currentPage) {
  // ... (unchanged)
}

// Helper: get current page name from path
function getPageFromPath(pathname) {
  // ... (unchanged)
}

// Message bubble component
const MessageBubble = ({ message, isUser }) => {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[80%] px-4 py-2 rounded-2xl ${
          isUser
            ? "bg-gradient-brand text-white rounded-br-sm"
            : "glass text-gray-800 dark:text-gray-200 rounded-bl-sm"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message}</p>
      </div>
    </div>
  );
};

// Typing indicator – respects reduced motion
const TypingIndicator = ({ reducedMotion }) => {
  const bounceClass = reducedMotion ? "" : "animate-bounce";
  return (
    <div className="flex justify-start mb-3" aria-label="AI is typing">
      <div className="glass px-4 py-2 rounded-2xl rounded-bl-sm">
        <div className="flex gap-1">
          <div
            className={`w-2 h-2 bg-gray-500 rounded-full ${bounceClass}`}
            style={{ animationDelay: "0ms" }}
          />
          <div
            className={`w-2 h-2 bg-gray-500 rounded-full ${bounceClass}`}
            style={{ animationDelay: "150ms" }}
          />
          <div
            className={`w-2 h-2 bg-gray-500 rounded-full ${bounceClass}`}
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
};

// Quick reply button component
const QuickReply = ({ text, onClick }) => {
  return (
    <button
      type="button"
      onClick={() => onClick(text)}
      className="px-3 py-1.5 text-sm rounded-full glass hover:bg-brand-500/20 hover:text-brand-500 transition-colors"
    >
      {text}
    </button>
  );
};

// Main ChatBot component
export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [quickReplies, setQuickReplies] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const location = useLocation();
  const reducedMotion = usePrefersReducedMotion();

  // Load chat history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("maniesta_chat_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed);
      } catch (e) {}
    } else {
      // Initial welcome message
      const welcomeIntent = detectIntent("help", getPageFromPath(location.pathname));
      const welcomeResponse = knowledgeBase[welcomeIntent]?.response({ page: getPageFromPath(location.pathname) }) || knowledgeBase.fallback.response;
      const welcomeQuick = knowledgeBase[welcomeIntent]?.quickReplies || knowledgeBase.fallback.quickReplies;
      setMessages([{ text: welcomeResponse, isUser: false, timestamp: Date.now() }]);
      setQuickReplies(welcomeQuick);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("maniesta_chat_history", JSON.stringify(messages.slice(-50))); // keep last 50
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  const addMessage = (text, isUser) => {
    setMessages(prev => [...prev, { text, isUser, timestamp: Date.now() }]);
  };

  const generateBotResponse = async (userMessage, currentPage) => {
    setIsTyping(true);
    // Simulate slight delay for realism
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));
    const intent = detectIntent(userMessage, currentPage);
    const context = { page: currentPage, lastUserMessage: userMessage };
    const response = knowledgeBase[intent]?.response(context) || knowledgeBase.fallback.response;
    const replies = knowledgeBase[intent]?.quickReplies || knowledgeBase.fallback.quickReplies;
    addMessage(response, false);
    setQuickReplies(replies);
    setIsTyping(false);
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    const message = inputValue.trim();
    if (!message) return;
    addMessage(message, true);
    setInputValue("");
    const currentPage = getPageFromPath(location.pathname);
    await generateBotResponse(message, currentPage);
  };

  const handleQuickReply = async (replyText) => {
    addMessage(replyText, true);
    setInputValue("");
    const currentPage = getPageFromPath(location.pathname);
    await generateBotResponse(replyText, currentPage);
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("maniesta_chat_history");
    // Reset welcome message
    const welcomeIntent = detectIntent("help", getPageFromPath(location.pathname));
    const welcomeResponse = knowledgeBase[welcomeIntent]?.response({ page: getPageFromPath(location.pathname) }) || knowledgeBase.fallback.response;
    const welcomeQuick = knowledgeBase[welcomeIntent]?.quickReplies || knowledgeBase.fallback.quickReplies;
    setMessages([{ text: welcomeResponse, isUser: false, timestamp: Date.now() }]);
    setQuickReplies(welcomeQuick);
  };

  // Motion props for floating button
  const floatBtnProps = reducedMotion
    ? {}
    : { whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 } };

  // Chat window content (reused for both animated and static)
  const chatWindowContent = (
    <>
      {/* Header */}
      <div className="shrink-0 px-4 py-3 border-b border-white/20 dark:border-white/10 flex justify-between items-center bg-white/50 dark:bg-gray-900/50 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold">AI</div>
          <h3 className="font-semibold text-gray-800 dark:text-white">Maniesta AI Assistant</h3>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={clearChat}
            className="text-gray-500 hover:text-brand-500 transition-colors"
            aria-label="Clear chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M8 6V4h8v2m-8 0h8v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            aria-label="Close chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg.text} isUser={msg.isUser} />
        ))}
        {isTyping && <TypingIndicator reducedMotion={reducedMotion} />}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick replies */}
      {quickReplies.length > 0 && (
        <div className="shrink-0 px-4 py-2 border-t border-white/20 dark:border-white/10 flex flex-wrap gap-2">
          {quickReplies.map((reply, idx) => (
            <QuickReply key={idx} text={reply} onClick={handleQuickReply} />
          ))}
        </div>
      )}

      {/* Input area */}
      <form onSubmit={handleSendMessage} className="shrink-0 p-3 border-t border-white/20 dark:border-white/10 bg-white/30 dark:bg-gray-900/30 backdrop-blur flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask me anything..."
          className="flex-1 px-3 py-2 rounded-xl bg-white/60 dark:bg-gray-800/60 border border-white/20 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
        />
        <button type="submit" disabled={!inputValue.trim()} className="btn-primary px-4 py-2 text-sm rounded-xl disabled:opacity-50">
          Send
        </button>
      </form>
    </>
  );

  return (
    <>
      {/* Floating button */}
      <motion.button
        type="button"
        {...floatBtnProps}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-brand text-white shadow-brand-lg flex items-center justify-center hover:shadow-xl transition-all"
        aria-label="Open AI Assistant"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </motion.button>

      {/* Chat Window */}
      {reducedMotion ? (
        isOpen && (
          <div
            className="fixed bottom-24 right-6 z-50 w-[90vw] sm:w-96 h-[70vh] sm:h-[600px] glass rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/20 dark:border-white/10"
            role="dialog"
            aria-modal="true"
            aria-label="AI Chat"
          >
            {chatWindowContent}
          </div>
        )
      ) : (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-24 right-6 z-50 w-[90vw] sm:w-96 h-[70vh] sm:h-[600px] glass rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/20 dark:border-white/10"
              role="dialog"
              aria-modal="true"
              aria-label="AI Chat"
            >
              {chatWindowContent}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}