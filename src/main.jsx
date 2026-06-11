import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";
import { DashboardProvider } from "./contexts/DashboardProvider"; // New import

class SystemErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[Maniesta System Failure]:", error, errorInfo);
  }

  handleRecovery = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 text-center animate-fade-in"
        >
          <div className="glass p-10 max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-red-500"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
              Application Error
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              The Maniesta Suite encountered an unexpected issue. Please reload
              the application to restore your session.
            </p>
            <button
              onClick={this.handleRecovery}
              className="btn-primary w-full"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function ApplicationBootstrapper({ children }) {
  React.useEffect(() => {
    document.documentElement.classList.add("theme-ready");
    document.documentElement.classList.remove("loading-state");
    const handleFirstTab = (e) => {
      if (e.key === "Tab") {
        document.body.classList.add("user-is-tabbing");
        window.removeEventListener("keydown", handleFirstTab);
      }
    };
    window.addEventListener("keydown", handleFirstTab);
    return () => window.removeEventListener("keydown", handleFirstTab);
  }, []);
  return children;
}

const container = document.getElementById("root");
if (!container) {
  throw new Error("Fatal: Maniesta root container not found.");
}

const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <DashboardProvider>
        <SystemErrorBoundary>
          <ApplicationBootstrapper>
            <App />
          </ApplicationBootstrapper>
        </SystemErrorBoundary>
      </DashboardProvider>
    </HelmetProvider>
  </React.StrictMode>,
);
