// src/components/ai-chat/ChatModal.jsx
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

export default function ChatModal({ isOpen, onClose, messages, isTyping, quickReplies, onSendMessage, onQuickReply, onClear }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-24 right-6 z-50 w-[90vw] sm:w-96 h-[70vh] sm:h-[600px] glass rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/20 dark:border-white/10"
        >
          {/* Header */}
          <div className="shrink-0 px-4 py-3 border-b border-white/20 dark:border-white/10 flex justify-between items-center bg-white/50 dark:bg-gray-900/50 backdrop-blur">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold">AI</div>
              <h3 className="font-semibold text-gray-800 dark:text-white">Academic Assistant</h3>
            </div>
            <div className="flex gap-2">
              <button onClick={onClear} className="text-gray-500 hover:text-brand-500 transition-colors" aria-label="Clear chat">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M8 6V4h8v2m-8 0h8v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6z" />
                </svg>
              </button>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <ChatMessages messages={messages} isTyping={isTyping} />

          {/* Input + Quick replies */}
          <ChatInput onSend={onSendMessage} onQuickReply={onQuickReply} quickReplies={quickReplies} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}