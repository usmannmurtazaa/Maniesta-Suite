// src/components/ai-chat/ChatMessages.jsx
import { useEffect, useRef, useState } from 'react';

/* ── Local hook: reduced motion detection ───────────────────────── */
function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefers(mq.matches);
    const handler = (e) => setPrefers(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return prefers;
}

const MessageBubble = ({ message, isUser }) => (
  <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
    <div
      className={`max-w-[80%] px-4 py-2 rounded-2xl ${
        isUser
          ? 'bg-gradient-brand text-white rounded-br-sm'
          : 'glass text-gray-800 dark:text-gray-200 rounded-bl-sm'
      }`}
    >
      <p className="text-sm whitespace-pre-wrap">{message}</p>
    </div>
  </div>
);

const TypingIndicator = () => {
  const reducedMotion = usePrefersReducedMotion();
  return (
    <div className="flex justify-start mb-3" aria-label="AI is typing">
      <div className="glass px-4 py-2 rounded-2xl rounded-bl-sm">
        <div className="flex gap-1">
          <div
            className={`w-2 h-2 bg-gray-500 rounded-full ${reducedMotion ? '' : 'animate-bounce'}`}
            style={{ animationDelay: '0ms' }}
          />
          <div
            className={`w-2 h-2 bg-gray-500 rounded-full ${reducedMotion ? '' : 'animate-bounce'}`}
            style={{ animationDelay: '150ms' }}
          />
          <div
            className={`w-2 h-2 bg-gray-500 rounded-full ${reducedMotion ? '' : 'animate-bounce'}`}
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  );
};

export default function ChatMessages({ messages, isTyping }) {
  const endRef = useRef(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.map((msg, idx) => (
        <MessageBubble key={idx} message={msg.content} isUser={msg.role === 'user'} />
      ))}
      {isTyping && <TypingIndicator />}
      <div ref={endRef} />
    </div>
  );
}