import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Frontend render failed", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="flex min-h-screen items-center justify-center px-4">
          <section className="glass w-full max-w-lg rounded-lg p-8">
            <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
            <p className="mt-3 text-sm text-slate-300">
              The dashboard hit a render error, but the app is still running. Refresh the page or try again shortly.
            </p>
            <pre className="mt-4 overflow-auto rounded-lg border border-rose-400/30 bg-rose-500/10 p-3 text-xs text-rose-100">
              {this.state.error?.message || "Unknown frontend error"}
            </pre>
            <button onClick={() => window.location.reload()} className="mt-5 rounded-lg bg-teal-400 px-4 py-3 font-semibold text-slate-950">
              Reload app
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root was not found");
}

createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
