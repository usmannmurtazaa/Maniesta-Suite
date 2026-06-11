// src/components/ai-chat/ChatInput.jsx
import { useState, useRef, useEffect } from 'react';

export default function ChatInput({ onSend, onQuickReply, quickReplies }) {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <div className="shrink-0 p-3 border-t border-white/20 dark:border-white/10 bg-white/30 dark:bg-gray-900/30 backdrop-blur">
      {/* Quick replies */}
      {quickReplies.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {quickReplies.map((reply, idx) => (
            <button
              key={idx}
              onClick={() => onQuickReply(reply)}
              className="px-3 py-1.5 text-sm rounded-full glass hover:bg-brand-500/20 hover:text-brand-500 transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          className="flex-1 px-3 py-2 rounded-xl bg-white/60 dark:bg-gray-800/60 border border-white/20 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
        />
        <button type="submit" disabled={!input.trim()} className="btn-primary px-4 py-2 text-sm rounded-xl disabled:opacity-50">
          Send
        </button>
      </form>
    </div>
  );
}