import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import AppRouter from "./router/AppRouter";
import Layout from "./components/layout/Layout";
import { initializeAnalytics } from "./services/firebase";

function App() {
  useEffect(() => {
    try {
      initializeAnalytics();
    } catch (error) {
      console.warn("Analytics initialization failed:", error);
    }
  }, []);

  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <ThemeProvider>
        <Layout>
          <AppRouter />
        </Layout>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
