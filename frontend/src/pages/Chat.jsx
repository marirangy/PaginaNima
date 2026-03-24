
import { useEffect, useMemo, useRef, useState } from "react";

function useSenderId() {
  return useMemo(() => {
    const k = "nima_sender_id";
    let v = localStorage.getItem(k);
    if (!v) {
      v = "web_" + Math.random().toString(36).slice(2, 8);
      localStorage.setItem(k, v);
    }
    return v;
  }, []);
}

const RASA_URL = "https://chatbotpt-nu3m.onrender.com/webhooks/rest/webhook";

export default function Chat() {
  const sender = useSenderId();
  const [messages, setMessages] = useState([
    { who: "bot", type: "text", text: "Hola, soy Nima. Estoy contigo 💜 ¿En qué te acompaño hoy?", ts: new Date() }
  ]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const listRef = useRef(null);
  const taRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  // Auto-resize del textarea
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  }, [text]);

  // Quick replies (botones)
  useEffect(() => {
    function onQuick(e) {
      const val = String(e.detail || "").trim();
      if (!val) return;
      setText(val);
      setTimeout(sendMessage, 0);
    }
    window.addEventListener("nima-quick", onQuick);
    return () => window.removeEventListener("nima-quick", onQuick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function sendMessage() {
    const t = text.trim();
    if (!t) return;
    setText("");
    const now = new Date();
    setMessages((m) => [...m, { who: "user", type: "text", text: t, ts: now }]);
    setTyping(true);

    try {
      const res = await fetch(RASA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender, message: t }),
      });

      const data = await res.json();
      const now2 = new Date();
      const botMsgs = [];

      (data || []).forEach((m) => {
        // 1) Texto
        if (m.text) botMsgs.push({ who: "bot", type: "text", text: m.text, ts: now2 });

        if (m.image) botMsgs.push({ who: "bot", type: "image", url: m.image, ts: now2 });

        if (Array.isArray(m.buttons) && m.buttons.length) {
          botMsgs.push({ who: "bot", type: "buttons", buttons: m.buttons, ts: now2 });
        }

        if (m.attachment?.type === "image" && m.attachment?.payload?.src) {
          botMsgs.push({ who: "bot", type: "image", url: m.attachment.payload.src, ts: now2 });
        }

        if (m.custom && typeof m.custom === "object") {
          const asText = m.custom.title || m.custom.text || JSON.stringify(m.custom);
          botMsgs.push({ who: "bot", type: "text", text: asText, ts: now2 });
        }
      });

      setMessages((m) => [...m, ...botMsgs]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { who: "bot", type: "text", text: "Hubo un problema al conectar con el servidor. Intenta de nuevo.", ts: new Date() },
      ]);
    } finally {
      setTyping(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-gradient-to-b from-[#F6E9FF] via-[#F7EAF6] to-[#FDE7F0]">
      <div className="w-full max-w-md rounded-[2rem] ring-1 ring-black/5 shadow-xl overflow-hidden bg-white/40 backdrop-blur">
        {/* Header */}
        <div className="relative px-5 pt-5 pb-4 bg-gradient-to-r from-[#B388FF] to-[#FF7EC9] text-white">
          <div className="absolute left-1/2 -translate-x-1/2 -top-3 h-6 w-36 bg-black/80 rounded-b-2xl" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/80 grid place-items-center text-[#B388FF] font-bold">
                N
              </div>
              <div>
                <div className="font-semibold text-lg leading-tight">Chat con Nima</div>
                <div className="text-xs opacity-90 flex items-center gap-1">
                  <span className="inline-block h-2 w-2 bg-emerald-300 rounded-full animate-pulse" />
                  Online
                </div>
              </div>
            </div>
            <div className="opacity-90">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="5" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="19" cy="12" r="2" />
              </svg>
            </div>
          </div>
        </div>

        {/* Lista de mensajes */}
        <div ref={listRef} className="h-[60vh] overflow-y-auto px-4 py-5 space-y-3">
          {messages.map((m, i) => (
            <Bubble key={i} who={m.who} ts={m.ts} text={m.text} type={m.type} url={m.url} buttons={m.buttons} />
          ))}
          {typing && <Typing />}
        </div>

        {/* Input */}
        <div className="px-4 pb-5">
          <div className="flex items-end gap-2 bg-white rounded-2xl shadow-md px-3 py-2 ring-1 ring-black/5">
            <button
              className="p-2 rounded-xl hover:bg-gray-100 transition"
              title="Adjuntar"
              type="button"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" className="text-gray-500">
                <path d="M21 8.5v6.75a5.75 5.75 0 1 1-11.5 0V6.75A3.75 3.75 0 0 1 17 6.75v7a2.75 2.75 0 1 1-5.5 0V8.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </button>

            <textarea
              ref={taRef}
              className="flex-1 resize-none outline-none bg-transparent text-[15px] leading-6 placeholder:text-gray-400 max-h-40"
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Escribe tu mensaje…"
            />

            <button
              className="p-2 rounded-xl bg-[#B388FF] hover:bg-[#a47dff] text-white transition disabled:opacity-50"
              onClick={sendMessage}
              disabled={!text.trim()}
              title="Enviar"
              type="button"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.4 20.6 21 12 3.4 3.4l2.8 7.2L15 12l-8.8 1.4z" />
              </svg>
            </button>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">
            Si hay peligro inmediato, llama al <strong>911</strong> o a la Línea Nacional <strong>800 911 25 11</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}

function Bubble({ who, text, ts, type = "text", url, buttons }) {
  const isUser = who === "user";
  const time = new Intl.DateTimeFormat("es-MX", { hour: "numeric", minute: "2-digit" }).format(ts);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[78%] rounded-2xl px-4 py-3 shadow-sm ${
          isUser
            ? "bg-[#8B5CF6] text-white rounded-br-md"
            : "bg-white text-gray-900 rounded-bl-md ring-1 ring-black/5"
        }`}
      >
        {type === "text" && (
          <p className="whitespace-pre-wrap text-[15px] leading-6">{text}</p>
        )}

        {type === "image" && (
          <img src={url} alt="contenido" className="rounded-xl max-h-80 object-contain" />
        )}

        {type === "buttons" && (
          <div className="flex flex-wrap gap-2">
            {Array.isArray(buttons) && buttons.map((b, i) => (
              <QuickBtn key={i} title={b.title} payload={b.payload} />
            ))}
          </div>
        )}

        <div className={`text-[10px] mt-1 ${isUser ? "text-white/80" : "text-gray-500"}`}>{time}</div>
      </div>
    </div>
  );
}

function QuickBtn({ title, payload }) {
  function sendQuick() {
    const ev = new CustomEvent("nima-quick", { detail: payload || title });
    window.dispatchEvent(ev);
  }
  return (
    <button
      onClick={sendQuick}
      className="px-3 py-1.5 rounded-full text-sm bg-[#F1EEFF] text-[#5B4AE1] hover:bg-[#E7E3FF] transition"
      type="button"
    >
      {title}
    </button>
  );
}

function Typing() {
  return (
    <div className="flex justify-start">
      <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 ring-1 ring-black/5 shadow-sm">
        <div className="flex items-center gap-1">
          <Dot /><Dot delay="150ms" /><Dot delay="300ms" />
        </div>
      </div>
    </div>
  );
}

function Dot({ delay = "0ms" }) {
  return (
    <span
      className="inline-block h-2 w-2 bg-gray-400 rounded-full animate-bounce"
      style={{ animationDelay: delay }}
    />
  );
}
