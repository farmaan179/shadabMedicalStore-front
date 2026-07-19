import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import api from "../api/api";

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi! I'm Shadab's assistant. Ask me about medicines, timings, or your order." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await api.post("/ai/ask", { question: userMsg.text });
      setMessages((m) => [...m, { role: "ai", text: res.data.answer }]);
    } catch (err) {
      setMessages((m) => [...m, { role: "ai", text: "Sorry, I'm having trouble connecting right now. Please call the store." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="btn btn-amber rounded-circle shadow position-fixed d-flex align-items-center justify-content-center animate-pulseSoft"
        style={{ bottom: "24px", right: "24px", width: "56px", height: "56px", zIndex: 1050 }}
      >
        {open ? <X color="#fff" /> : <MessageCircle color="#fff" />}
      </button>

      {open && (
        <div
          className="position-fixed bg-white rounded-4 shadow-lg border d-flex flex-column overflow-hidden animate-floatUp"
          style={{ bottom: "90px", right: "24px", width: "320px", height: "380px", zIndex: 1050 }}
        >
          <div className="bg-teal-deep text-white px-3 py-2 fw-semibold">Ask Shadab AI</div>
          <div className="flex-grow-1 overflow-auto p-3 d-flex flex-column gap-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`small px-3 py-2 rounded-3 ${m.role === "user" ? "bg-teal-deep text-white ms-auto" : "bg-cream"}`}
                style={{ maxWidth: "85%" }}
              >
                {m.text}
              </div>
            ))}
            {loading && <div className="text-muted small">Typing...</div>}
            <div ref={bottomRef} />
          </div>
          <div className="d-flex border-top p-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask anything..."
              className="form-control form-control-sm border-0"
            />
            <button onClick={send} className="btn btn-sm text-teal-deep">
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}