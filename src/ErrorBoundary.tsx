import React from "react";

export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error?: Error }
> {
  state: { error?: Error } = {};
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 16 }}>
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              border: "1px solid #fca5a5",
              borderRadius: 12,
              padding: 16,
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
            }}
          >
            <b>Грешка в приложението</b>
            <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>
              {this.state.error.message}
            </div>
            <button
              onClick={() => (window.location.href = window.location.href)}
              style={{
                marginTop: 12,
                padding: "8px 12px",
                borderRadius: 10,
                background: "#111827",
                color: "white",
                border: 0,
                cursor: "pointer",
              }}
            >
              Презареди
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
