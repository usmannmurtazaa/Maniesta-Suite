// src/components/chat/ChatBot.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// ── Knowledge Base ──────────────────────────────────────────────────────
const knowledgeBase = {
  gpa: {
    keywords: ["gpa", "grade point average", "calculate gpa", "gpa calculator", "how is gpa calculated"],
    response: (context) => {
      const pageContext = context?.page === "gpa" ? " You're on the GPA page – you can add your courses, set credit hours, and click 'Calculate Semester GPA' to see your result." : "";
      return `GPA (Grade Point Average) measures your academic performance in a single semester. To calculate:\n1. Convert each letter grade to grade points (A=4.0, B=3.0, etc.)\n2. Multiply grade points by credit hours for each course\n3. Sum all quality points and total credit hours\n4. Divide total quality points by total credits${pageContext}\nWant to try it now? Use the GPA Calculator above.`;
    },
    quickReplies: ["How to calculate CGPA?", "Export my GPA", "What is a good GPA?"],
  },
  cgpa: {
    keywords: ["cgpa", "cumulative gpa", "calculate cgpa", "cgpa calculator", "overall gpa"],
    response: (context) => {
      const pageContext = context?.page === "cgpa" ? " On the CGPA page, add your semester GPAs and click 'Calculate Cumulative CGPA' to see your overall average." : "";
      return `CGPA (Cumulative Grade Point Average) is the average of your GPA across all completed semesters.\nCalculation: Sum of all semester GPAs ÷ Number of semesters.\nFor weighted CGPA (different credits per semester): (GPA₁×Credits₁ + ...) ÷ Total credits.${pageContext}`;
    },
    quickReplies: ["How to improve CGPA?", "What is GPA?", "Export my CGPA"],
  },
  export: {
    keywords: ["export", "pdf", "csv", "download report", "export gpa", "export cgpa", "save as pdf", "generate report"],
    response: (context) => {
      const pageContext = context?.page === "gpa" || context?.page === "cgpa" ? " After calculating, click the 'Export Academic Record' button, fill in your details, and generate both PDF and CSV files." : " Go to the GPA or CGPA page, calculate your result, then click 'Export Academic Record' to get a professional PDF or CSV report.";
      return `To export your academic record:${pageContext}\nThe PDF includes your course table, GPA/CGPA, and academic standing – perfect for scholarships or job applications. The CSV can be opened in Excel or Google Sheets.`;
    },
    quickReplies: ["What's in the PDF?", "How to open CSV?", "Back to GPA"],
  },
  currency: {
    keywords: ["currency", "exchange rate", "convert money", "usd to eur", "currency converter", "live rate"],
    response: () => {
      return `Our Currency Converter uses live exchange rates from a free API.\nTo use:\n1. Go to the Currency Converter page (Tools → Currency Converter)\n2. Enter the amount\n3. Select "From" and "To" currencies\n4. The converted amount updates instantly.\nRates are cached for 1 hour and update automatically.`;
    },
    quickReplies: ["How accurate are rates?", "Swap currencies", "Convert USD to PKR"],
  },
  unitConverter: {
    keywords: ["unit converter", "convert length", "convert weight", "temperature conversion", "unit conversion"],
    response: () => {
      return `The Unit Converter supports length, weight, temperature, area, currency, time, and speed.\nJust select a category, choose units, enter a value, and click "Convert". You can also swap units with the ⇄ button.`;
    },
    quickReplies: ["Convert kilometers to miles", "Convert Celsius to Fahrenheit", "Back to home"],
  },
  interest: {
    keywords: ["interest calculator", "simple interest", "compound interest", "loan emi", "interest rate"],
    response: () => {
      return `The Interest Calculator offers three modes:\n- Simple Interest: I = P × r × t\n- Compound Interest: A = P(1 + r/n)^(nt)\n- Loan EMI: monthly payment for fixed-rate loans.\nFill in principal, rate, time, and frequency (for compound) then click "Calculate".`;
    },
    quickReplies: ["What's the formula for EMI?", "Calculate compound interest", "Go to Interest page"],
  },
  scientific: {
    keywords: ["scientific calculator", "sin", "cos", "tan", "log", "ln", "sqrt", "pi", "exponential"],
    response: () => {
      return `The Scientific Calculator supports trigonometric functions (sin, cos, tan, asin, acos, atan), logarithms (log, ln), square root, cube root, powers (x², x³, xʸ), constants π and e, factorials, and parentheses.\nSwitch between normal and scientific modes at the top of the calculator.`;
    },
    quickReplies: ["How to calculate sin(30°)?", "What's the factorial?", "Normal calculator mode"],
  },
  normalCalculator: {
    keywords: ["normal calculator", "basic calculator", "add subtract multiply divide", "calculator"],
    response: () => {
      return `The Normal Calculator supports addition, subtraction, multiplication, division, percentages, and memory functions (MC, MR, M+, M-). You can also use your keyboard for input. History is saved for the session.`;
    },
    quickReplies: ["Keyboard shortcuts?", "Clear memory", "Scientific mode"],
  },
  greeting: {
    keywords: ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "help", "what can you do"],
    response: () => {
      return `Hello! I'm Maniesta AI Assistant. I can help you with:\n- GPA & CGPA calculations\n- Exporting PDF/CSV reports\n- Currency & unit conversion\n- Interest calculations\n- Using scientific/normal calculators\nJust ask me anything about our tools!`;
    },
    quickReplies: ["How to calculate GPA?", "Export guide", "Currency converter"],
  },
  fallback: {
    response: "I'm not sure I understand. You can ask me about GPA, CGPA, export, currency converter, unit converter, interest calculator, or scientific calculator. Try one of the suggestions!",
    quickReplies: ["How to calculate GPA?", "Export PDF", "Currency converter"],
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────
function detectIntent(message, currentPage) {
  const lowerMsg = message.toLowerCase();
  const pageIntents = {
    gpa: ["gpa", "grade point average", "calculate gpa"],
    cgpa: ["cgpa", "cumulative gpa"],
    export: ["export", "pdf", "csv", "download report"],
    currency: ["currency", "exchange rate", "convert money"],
    unitconverter: ["unit converter", "convert length", "convert weight"],
    interest: ["interest calculator", "simple interest", "compound interest"],
    scientific: ["scientific calculator", "sin", "cos", "tan", "log", "ln", "sqrt"],
    normalcalculator: ["normal calculator", "basic calculator", "add subtract"],
  };
  const currentIntent = pageIntents[currentPage];
  if (currentIntent && currentIntent.some(keyword => lowerMsg.includes(keyword))) {
    const intentKey = currentPage === "unitconverter" ? "unitConverter" : (currentPage === "normalcalculator" ? "normalCalculator" : currentPage);
    if (knowledgeBase[intentKey]) return intentKey;
  }
  for (const [key, data] of Object.entries(knowledgeBase)) {
    if (key === "fallback" || key === "greeting") continue;
    if (data.keywords && data.keywords.some(kw => lowerMsg.includes(kw))) {
      return key;
    }
  }
  if (knowledgeBase.greeting.keywords.some(kw => lowerMsg.includes(kw))) return "greeting";
  return "fallback";
}

function getPageFromPath(pathname) {
  if (pathname.includes("/gpa")) return "gpa";
  if (pathname.includes("/cgpa")) return "cgpa";
  if (pathname.includes("/export")) return "export";
  if (pathname.includes("/currency")) return "currency";
  if (pathname.includes("/converter")) return "unitconverter";
  if (pathname.includes("/interest")) return "interest";
  if (pathname.includes("/calculator")) return "scientific";
  return "home";
}

// ── Custom Hooks ──────────────────────────────────────────────────────
function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);
  return prefersReducedMotion;
}

function useFocusTrap(containerRef, isActive, onEscape) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onEscape?.();
        return;
      }
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable?.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable?.focus();
          }
        }
      }
    };
    container.addEventListener("keydown", handleKeyDown);
    // Focus the first focusable element
    setTimeout(() => firstFocusable?.focus(), 100);

    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [isActive, containerRef, onEscape]);
}

// ── Subcomponents ───────────────────────────────────────────────────────
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

const TypingIndicator = ({ reducedMotion }) => {
  return (
    <div className="flex justify-start mb-3">
      <div className="glass px-4 py-2 rounded-2xl rounded-bl-sm">
        <div className="flex gap-1">
          <div
            className={`w-2 h-2 bg-gray-500 rounded-full ${reducedMotion ? "" : "animate-bounce"}`}
            style={reducedMotion ? {} : { animationDelay: "0ms" }}
          />
          <div
            className={`w-2 h-2 bg-gray-500 rounded-full ${reducedMotion ? "" : "animate-bounce"}`}
            style={reducedMotion ? {} : { animationDelay: "150ms" }}
          />
          <div
            className={`w-2 h-2 bg-gray-500 rounded-full ${reducedMotion ? "" : "animate-bounce"}`}
            style={reducedMotion ? {} : { animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
};

const QuickReply = ({ text, onClick }) => {
  return (
    <button
      onClick={() => onClick(text)}
      className="px-3 py-1.5 text-sm rounded-full glass hover:bg-brand-500/20 hover:text-brand-500 transition-colors"
    >
      {text}
    </button>
  );
};

// ── Main Component ──────────────────────────────────────────────────────
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

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Load chat history
  useEffect(() => {
    const saved = localStorage.getItem("maniesta_chat_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed);
      } catch (e) {}
    } else {
      const welcomeIntent = detectIntent("help", getPageFromPath(location.pathname));
      const welcomeResponse = knowledgeBase[welcomeIntent]?.response({ page: getPageFromPath(location.pathname) }) || knowledgeBase.fallback.response;
      const welcomeQuick = knowledgeBase[welcomeIntent]?.quickReplies || knowledgeBase.fallback.quickReplies;
      setMessages([{ text: welcomeResponse, isUser: false, timestamp: Date.now() }]);
      setQuickReplies(welcomeQuick);
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("maniesta_chat_history", JSON.stringify(messages.slice(-50)));
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

  const addMessage = (text, isUser) => {
    setMessages(prev => [...prev, { text, isUser, timestamp: Date.now() }]);
  };

  const generateBotResponse = async (userMessage, currentPage) => {
    setIsTyping(true);
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
    const welcomeIntent = detectIntent("help", getPageFromPath(location.pathname));
    const welcomeResponse = knowledgeBase[welcomeIntent]?.response({ page: getPageFromPath(location.pathname) }) || knowledgeBase.fallback.response;
    const welcomeQuick = knowledgeBase[welcomeIntent]?.quickReplies || knowledgeBase.fallback.quickReplies;
    setMessages([{ text: welcomeResponse, isUser: false, timestamp: Date.now() }]);
    setQuickReplies(welcomeQuick);
  };

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