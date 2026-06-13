// src/components/chat/ChatBot.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useFocusTrap } from "../../hooks/useFocusTrap";

// ... (knowledgeBase, detectIntent, getPageFromPath unchanged)

const MessageBubble = ({ message, isUser }) => { ... };
const TypingIndicator = ({ reducedMotion }) => { ... };
const QuickReply = ({ text, onClick }) => { ... };

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [quickReplies, setQuickReplies] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatWindowRef = useRef(null);
  const location = useLocation();
  const reducedMotion = usePrefersReducedMotion();

  // Focus trap + scroll lock
  useFocusTrap(chatWindowRef, isOpen, () => setIsOpen(false));

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // ... (rest of the logic: load history, send message, clear chat, etc.)

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
        whileHover={reducedMotion ? {} : { scale: 1.1 }}
        whileTap={reducedMotion ? {} : { scale: 0.9 }}
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
            ref={chatWindowRef}
            className="fixed bottom-24 right-6 z-50 w-[90vw] sm:w-96 h-[70dvh] sm:h-[600px] glass rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/20 dark:border-white/10"
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
              ref={chatWindowRef}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-24 right-6 z-50 w-[90vw] sm:w-96 h-[70dvh] sm:h-[600px] glass rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/20 dark:border-white/10"
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