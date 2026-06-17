// src/components/layout/Layout.jsx
import { lazy, Suspense, useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { motion } from "framer-motion";
import { useAIChat } from "../../hooks/useAIChat";

// Lazy load AI Assistant components
const ChatButton = lazy(() => import("../ai-chat/ChatButton"));
const ChatModal = lazy(() => import("../ai-chat/ChatModal"));

/**
 * Local hook to detect the user’s motion preference.
 * (May be extracted to a shared utility later.)
 */
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

export default function Layout({ children }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const location = useLocation();
  const {
    messages,
    isTyping,
    quickReplies,
    sendMessage,
    clearHistory,
    setContext,
    context,
  } = useAIChat();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Update context when page changes – avoid unnecessary updates
  useEffect(() => {
    // Extract last GPA from localStorage (saved after calculations)
    let lastGPA = null;
    try {
      const saved = localStorage.getItem("maniesta_last_gpa");
      if (saved) lastGPA = JSON.parse(saved).value;
    } catch {}

    const newPage =
      location.pathname === "/" ? "home" : location.pathname.slice(1) || "home";
    const newToolActive = location.pathname.includes("gpa")
      ? "gpa"
      : location.pathname.includes("cgpa")
        ? "cgpa"
        : location.pathname.includes("currency")
          ? "currency"
          : location.pathname.includes("export")
            ? "export"
            : location.pathname.includes("dashboard")
              ? "dashboard"
              : null;

    // Only update context if something actually changed
    if (
      context.page !== newPage ||
      context.toolActive !== newToolActive ||
      context.lastGPA !== lastGPA
    ) {
      setContext((prev) => ({
        ...prev,
        page: newPage,
        toolActive: newToolActive,
        lastGPA,
      }));
    }
  }, [
    location.pathname,
    setContext,
    context.page,
    context.toolActive,
    context.lastGPA,
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 relative">
      {/* Lightweight CSS background blobs – replaced Framer Motion for performance */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-purple-400/20 dark:bg-purple-800/20 rounded-full blur-3xl floating-blob" />
        <div className="absolute top-1/3 -right-20 w-[400px] h-[400px] bg-pink-400/20 dark:bg-pink-800/20 rounded-full blur-3xl floating-blob animate-delay-1000" />
        <div className="absolute bottom-20 left-10 w-[350px] h-[350px] bg-indigo-400/20 dark:bg-indigo-800/20 rounded-full blur-3xl floating-blob animate-delay-2000" />
      </div>

      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 pt-24 pb-12">
        {children}
      </main>
      <Footer />

      {/* AI Academic Assistant – lazy loaded */}
      <Suspense fallback={null}>
        <ChatButton
          onClick={() => setIsChatOpen(!isChatOpen)}
          isOpen={isChatOpen}
        />
        <ChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          messages={messages}
          isTyping={isTyping}
          quickReplies={quickReplies}
          onSendMessage={sendMessage}
          onQuickReply={sendMessage}
          onClear={clearHistory}
        />
      </Suspense>
    </div>
  );
}