import { useState } from "react";
import { api } from "../api/client";
import { useNavigate } from "react-router-dom";
import "./AiChat.css";

export default function AiChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "ai", text: "Merhaba! Hangi tedaviyi düşünüyorsunuz? Şikayetinizi veya tedavi türünü yazabilirsiniz." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate();

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");
    setLoading(true);
    try {
      const res = await api.aiMatch({ complaint: text, answers });
      let reply = "";
      if (res.dynamicQuestions?.length > 0) {
        reply = res.dynamicQuestions[0];
        setAnswers((a) => [...a, text]);
      } else {
        reply = `${res.suggestedTreatment} için uygun klinikler bulundu. Tahmini fiyat: ${res.priceRange || "klinikle iletişime geçin"}`;
        if (res.matchedClinics?.length > 0) {
          setMessages((m) => [
            ...m,
            { from: "ai", text: reply },
            { from: "ai", type: "clinics", clinics: res.matchedClinics.slice(0, 3) }
          ]);
          setLoading(false);
          return;
        }
      }
      setMessages((m) => [...m, { from: "ai", text: reply }]);
    } catch {
      setMessages((m) => [...m, { from: "ai", text: "Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin." }]);
    } finally { setLoading(false); }
  };

  return (
    <>
      <button className="aichat-fab" onClick={() => setOpen((o) => !o)} title="AI Asistan">
        {open ? "✕" : "🤖"}
      </button>
      {open && (
        <div className="aichat-panel">
          <div className="aichat-header">
            <span>🤖 AI Sağlık Asistanı</span>
            <small>AI teşhis koymaz</small>
          </div>
          <div className="aichat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`aichat-msg ${m.from}`}>
                {m.type === "clinics" ? (
                  <div className="aichat-clinics">
                    {m.clinics.map((c) => (
                      <div key={c.clinicId} className="aichat-clinic-chip" onClick={() => { navigate(`/clinic/${c.slug}`); setOpen(false); }}>
                        <img src={c.imageUrl} alt={c.clinicName} />
                        <div>
                          <div className="aichat-clinic-name">{c.clinicName}</div>
                          <div className="aichat-clinic-city">{c.city} · %{c.matchScore}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span>{m.text}</span>
                )}
              </div>
            ))}
            {loading && <div className="aichat-msg ai"><span className="aichat-typing">···</span></div>}
          </div>
          <div className="aichat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Şikayetinizi veya tedavinizi yazın..."
            />
            <button onClick={send} disabled={loading || !input.trim()}>Gönder</button>
          </div>
        </div>
      )}
    </>
  );
}
