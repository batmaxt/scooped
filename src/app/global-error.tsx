"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 2rem",
          background: "#FFF7ED",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          color: "#2E1F1B",
        }}
      >
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }} aria-hidden>
          🍨
        </div>
        <h1 style={{ fontSize: "1.5rem", margin: "0 0 0.5rem" }}>
          Well, that melted.
        </h1>
        <p
          style={{
            fontSize: "0.875rem",
            opacity: 0.7,
            maxWidth: "20rem",
            margin: "0 0 2rem",
            lineHeight: 1.6,
          }}
        >
          Something went wrong. Give it another scoop.
        </p>
        <button
          onClick={reset}
          style={{
            height: "3rem",
            padding: "0 2rem",
            borderRadius: "9999px",
            background: "#C4364A",
            color: "white",
            fontSize: "0.875rem",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
