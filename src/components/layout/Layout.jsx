// src/components/layout/Layout.jsx
import { lazy, Suspense, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { motion } from "framer-motion";
import { useAIChat } from "../../hooks/useAIChat";

// Lazy load AI Assistant components
const ChatButton = lazy(() => import("../ai-chat/ChatButton"));
const ChatModal = lazy(() => import("../ai-chat/ChatModal"));

export default function Layout({ children }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const location = useLocation();
  const { messages, isTyping, quickReplies, sendMessage, clearHistory, setContext, context } = useAIChat();

  // Update context when page changes
  useEffect(() => {
    // Extract last GPA from localStorage (saved after calculations)
    let lastGPA = null;
    try {
      const saved = localStorage.getItem("maniesta_dashboard_last_gpa");
      if (saved) lastGPA = JSON.parse(saved).value;
    } catch {}
    setContext(prev => ({
      ...prev,
      page: location.pathname === "/" ? "home" : location.pathname.slice(1) || "home",
      toolActive: location.pathname.includes("gpa") ? "gpa"
        : location.pathname.includes("cgpa") ? "cgpa"
        : location.pathname.includes("currency") ? "currency"
        : location.pathname.includes("export") ? "export"
        : location.pathname.includes("dashboard") ? "dashboard"
        : null,
      lastGPA,
    }));
  }, [location.pathname, setContext]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 relative">
      {/* Animated background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [-50, 50, -50], y: [-30, 30, -30] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-purple-400/20 dark:bg-purple-800/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [40, -40, 40], y: [20, -20, 20] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/3 -right-20 w-[400px] h-[400px] bg-pink-400/20 dark:bg-pink-800/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [-20, 20, -20], y: [50, -50, 50] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 left-10 w-[350px] h-[350px] bg-indigo-400/20 dark:bg-indigo-800/20 rounded-full blur-3xl"
        />
      </div>

      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 pt-24 pb-12">
        {children}
      </main>
      <Footer />

      {/* AI Academic Assistant – lazy loaded */}
      <Suspense fallback={null}>
        <ChatButton onClick={() => setIsChatOpen(!isChatOpen)} isOpen={isChatOpen} />
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