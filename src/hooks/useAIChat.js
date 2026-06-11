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
    const mountedRef = useRef(true);

    // Load chat history from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setMessages(parsed.slice(-MAX_HISTORY));
            } catch (e) { }
        }
    }, []);

    // Save messages on change
    useEffect(() => {
        if (messages.length) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_HISTORY)));
        }
    }, [messages]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            mountedRef.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
            }
        };
    }, []);

    const sendMessage = useCallback(async (userMessage) => {
        if (!userMessage.trim()) return;

        // Cancel any previous in‑flight request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        // Add user message using functional update (avoids depending on `messages`)
        setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: Date.now() }]);

        if (mountedRef.current) setIsTyping(true);

        try {
            const { reply, suggestions, updatedContext } = await generateAIResponse(
                userMessage,
                { ...context, messages: messages }, // note: context & messages are captured here, but messages will be the latest after the functional update above? Actually we need the previous messages array after the user message is added. Since we used functional update, we don't have the new array yet. So we can capture the previous messages before adding the user one, or read the latest via a ref. Better: read the current messages before the update, add the user message manually for the context.
                { signal: controller.signal }
            );

            // Now add assistant reply
            setMessages(prev => [...prev, { role: 'assistant', content: reply, timestamp: Date.now() }]);
            if (mountedRef.current) {
                setQuickReplies(suggestions || []);
                if (updatedContext) setContext(prev => ({ ...prev, ...updatedContext }));
            }
        } catch (err) {
            if (err.name !== 'AbortError' && mountedRef.current) {
                setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I had trouble responding. Please try again.', timestamp: Date.now() }]);
            }
        } finally {
            if (mountedRef.current) setIsTyping(false);
            abortControllerRef.current = null;
        }
    }, [context, messages]); // we keep context and messages as deps for the API call; but we could store messages in a ref to avoid depending on messages for re-creation of sendMessage. However, to avoid stale data in the API call, we need the latest messages. Using a ref for messages would solve that. I'll introduce a messagesRef that always holds the latest messages and use it inside sendMessage, thus eliminating `messages` from deps, making sendMessage stable.

    // To make sendMessage stable (not dependent on messages), use a ref for messages and context.
    const messagesRef = useRef(messages);
    const contextRef = useRef(context);
    useEffect(() => { messagesRef.current = messages; }, [messages]);
    useEffect(() => { contextRef.current = context; }, [context]);

    const sendMessageStable = useCallback(async (userMessage) => {
        if (!userMessage.trim()) return;

        // Cancel previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const controller = new AbortController();
        abortControllerRef.current = controller;

        // Add user message using functional update
        setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: Date.now() }]);

        if (mountedRef.current) setIsTyping(true);

        try {
            const { reply, suggestions, updatedContext } = await generateAIResponse(
                userMessage,
                { ...contextRef.current, messages: messagesRef.current },
                { signal: controller.signal }
            );

            setMessages(prev => [...prev, { role: 'assistant', content: reply, timestamp: Date.now() }]);
            if (mountedRef.current) {
                setQuickReplies(suggestions || []);
                if (updatedContext) setContext(prev => ({ ...prev, ...updatedContext }));
            }
        } catch (err) {
            if (err.name !== 'AbortError' && mountedRef.current) {
                setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I had trouble responding. Please try again.', timestamp: Date.now() }]);
            }
        } finally {
            if (mountedRef.current) setIsTyping(false);
            abortControllerRef.current = null;
        }
    }, []); // stable – no external deps

    const clearHistory = useCallback(() => {
        // Abort any pending request to prevent it from resurrecting messages after clearing
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setMessages([]);
        localStorage.removeItem(STORAGE_KEY);
        setQuickReplies([]);
        if (mountedRef.current) setIsTyping(false);
    }, []);

    return {
        messages,
        isTyping,
        quickReplies,
        sendMessage: sendMessageStable, // expose the stable version
        clearHistory,
        setContext,
        context,
    };
}