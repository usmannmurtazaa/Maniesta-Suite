import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

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
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100dvh",
            padding: "24px",
            backgroundColor: "var(--bg-color, #ffffff)",
            color: "var(--text-color, #1d1d1f)",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
            textAlign: "center",
            animation: "errorFadeIn 0.5s ease",
          }}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{ opacity: 0.8, marginBottom: 24 }}
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 600,
              margin: "0 0 0.75rem 0",
            }}
          >
            Application Error
          </h1>
          <p
            style={{
              fontSize: "0.9375rem",
              lineHeight: 1.5,
              opacity: 0.7,
              maxWidth: 420,
              margin: "0 0 2rem 0",
            }}
          >
            The Maniesta Suite encountered an unexpected issue. Please reload
            the application to restore your session.
          </p>
          <button
            onClick={this.handleRecovery}
            style={{
              appearance: "none",
              backgroundColor: "var(--text-color, #1d1d1f)",
              color: "var(--bg-color, #ffffff)",
              border: "1px solid transparent",
              padding: "0.75rem 1.75rem",
              borderRadius: 999,
              fontSize: "0.9375rem",
              fontWeight: 500,
              cursor: "pointer",
              minWidth: 160,
            }}
          >
            Reload Application
          </button>
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
    <SystemErrorBoundary>
      <ApplicationBootstrapper>
        <App />
      </ApplicationBootstrapper>
    </SystemErrorBoundary>
  </React.StrictMode>,
);
