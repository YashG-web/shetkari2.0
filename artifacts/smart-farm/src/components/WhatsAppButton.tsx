import { useState } from "react";

// Your WhatsApp Business number in international format (no +, no spaces)
// Replace with your actual WhatsApp Business number
const WHATSAPP_NUMBER = "15551601310"; // Meta test number: +1 555 160 1310
const PRELOADED_MESSAGE = "Hello SHETKARI! I need farming advice. 🌾";

export function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(PRELOADED_MESSAGE)}`;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "28px",
        right: "28px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "10px",
      }}
    >
      {/* Tooltip */}
      <div
        style={{
          transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0) scale(1)" : "translateY(6px) scale(0.95)",
          pointerEvents: "none",
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          color: "#ffffff",
          fontSize: "13px",
          fontWeight: "600",
          padding: "8px 14px",
          borderRadius: "12px",
          whiteSpace: "nowrap",
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.08)",
          letterSpacing: "0.01em",
        }}
        aria-hidden="true"
      >
        🤖 Chat with AI Farming Assistant
        <div
          style={{
            position: "absolute",
            bottom: "-5px",
            right: "22px",
            width: "10px",
            height: "10px",
            background: "#16213e",
            transform: "rotate(45deg)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderTop: "none",
            borderLeft: "none",
          }}
        />
      </div>

      {/* Pulse ring */}
      <div style={{ position: "relative", width: "60px", height: "60px" }}>
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "rgba(37, 211, 102, 0.35)",
            animation: "whatsapp-pulse 2.5s ease-out infinite",
          }}
        />
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "rgba(37, 211, 102, 0.2)",
            animation: "whatsapp-pulse 2.5s ease-out infinite 0.8s",
          }}
        />

        {/* Main Button */}
        <a
          id="whatsapp-ai-assistant-btn"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with AI Farming Assistant on WhatsApp"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            background: hovered
              ? "linear-gradient(145deg, #20d05a 0%, #128C7E 100%)"
              : "linear-gradient(145deg, #25D366 0%, #1DAB5B 100%)",
            boxShadow: hovered
              ? "0 8px 32px rgba(37, 211, 102, 0.6), 0 2px 8px rgba(0,0,0,0.2)"
              : "0 4px 20px rgba(37, 211, 102, 0.45), 0 2px 6px rgba(0,0,0,0.15)",
            transform: hovered ? "scale(1.1) translateY(-2px)" : "scale(1) translateY(0)",
            transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
            textDecoration: "none",
            outline: "none",
            cursor: "pointer",
          }}
        >
          {/* WhatsApp SVG Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            width="30"
            height="30"
            fill="white"
            aria-hidden="true"
          >
            <path d="M16.004 0C7.165 0 0 7.164 0 15.998c0 2.824.745 5.482 2.044 7.789L.057 32l8.41-2.203A15.947 15.947 0 0016.004 32C24.836 32 32 24.835 32 16.001 32 7.164 24.836 0 16.004 0zm0 29.274a13.22 13.22 0 01-6.73-1.836l-.482-.287-4.993 1.307 1.337-4.869-.315-.5a13.217 13.217 0 01-2.073-7.09c0-7.303 5.95-13.247 13.256-13.247 3.54 0 6.87 1.38 9.37 3.882a13.19 13.19 0 013.876 9.37c0 7.307-5.944 13.27-13.246 13.27zm7.274-9.923c-.398-.2-2.357-1.162-2.72-1.295-.364-.133-.63-.2-.896.2-.265.398-1.028 1.295-1.26 1.56-.232.264-.463.297-.861.099-.398-.2-1.682-.62-3.203-1.977-1.183-1.057-1.981-2.363-2.214-2.76-.232-.398-.025-.614.174-.812.18-.18.398-.464.598-.695.2-.232.265-.398.398-.663.132-.265.066-.497-.034-.696-.1-.2-.897-2.16-1.228-2.957-.323-.776-.651-.67-.896-.683-.232-.012-.497-.015-.763-.015s-.696.1-1.06.497c-.364.398-1.393 1.361-1.393 3.32 0 1.96 1.427 3.853 1.627 4.119.2.265 2.808 4.285 6.803 6.01.95.41 1.692.655 2.271.839.954.304 1.822.26 2.508.157.765-.114 2.357-.963 2.69-1.894.332-.93.332-1.727.232-1.895-.099-.166-.365-.265-.763-.464z" />
          </svg>
        </a>
      </div>

      {/* Inline keyframes via style tag */}
      <style>{`
        @keyframes whatsapp-pulse {
          0% { transform: scale(1); opacity: 1; }
          70% { transform: scale(1.65); opacity: 0; }
          100% { transform: scale(1.65); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
