// src/hooks/useAIChat.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { generateAIResponse } from '../services/aiService';

const STORAGE_KEY = 'maniesta_ai_chat';
const MAX_HISTORY = 30;

export function useAIChat(initialContext = {}) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [quickReplies, setQuickReplies] = useState([]);
  const [context, setContext] = useState(initialContext);
  const abortControllerRef = useRef(null);

  // Load chat history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setMessages(parsed.slice(-MAX_HISTORY));
      } catch (e) {}
    }
  }, []);

  // Save messages on change
  useEffect(() => {
    if (messages.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_HISTORY)));
    }
  }, [messages]);

  const sendMessage = useCallback(async (userMessage) => {
    if (!userMessage.trim()) return;

    // Add user message
    const newMessages = [...messages, { role: 'user', content: userMessage, timestamp: Date.now() }];
    setMessages(newMessages);
    setIsTyping(true);

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const { reply, suggestions, updatedContext } = await generateAIResponse(
        userMessage,
        { ...context, messages: newMessages },
        { signal: controller.signal }
      );

      setMessages(prev => [...prev, { role: 'assistant', content: reply, timestamp: Date.now() }]);
      setQuickReplies(suggestions || []);
      if (updatedContext) setContext(prev => ({ ...prev, ...updatedContext }));
    } catch (err) {
      if (err.name !== 'AbortError') {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I had trouble responding. Please try again.', timestamp: Date.now() }]);
      }
    } finally {
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  }, [messages, context]);

  const clearHistory = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    setQuickReplies([]);
  }, []);

  return { messages, isTyping, quickReplies, sendMessage, clearHistory, setContext, context };
}