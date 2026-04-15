import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useApp } from "../context/AppContext";
import "./OnboardingPage.css";

const STEPS = [
  {
    key: "treatmentType",
    question: "Hangi tedaviyi düşünüyorsunuz?",
    type: "grid",
    options: [
      { label: "Saç Ekimi",   icon: "💈" },
      { label: "Diş İmplantı",icon: "🦷" },
      { label: "Göz Lazeri",  icon: "👁️" },
      { label: "Estetik",     icon: "✨" },
      { label: "Rinoplasti",  icon: "👃" },
      { label: "Ortopedi",    icon: "🦴" },
      { label: "Botoks",      icon: "💉" },
      { label: "Diğer",       icon: "🏥" },
    ],
  },
  {
    key: "budget",
    question: "Bütçeniz nedir?",
    type: "grid",
    options: [
      { label: "< $500",     icon: "💵" },
      { label: "$500–$2.000",icon: "💰" },
      { label: "$2.000–$5.000",icon:"💳" },
      { label: "$5.000+",    icon: "💎" },
      { label: "Bilmiyorum", icon: "🤷" },
    ],
  },
  {
    key: "country",
    question: "Hangi ülkeden geliyorsunuz?",
    type: "grid",
    options: [
      { label: "Türkiye",   icon: "🇹🇷" },
      { label: "Almanya",   icon: "🇩🇪" },
      { label: "İngiltere", icon: "🇬🇧" },
      { label: "Fransa",    icon: "🇫🇷" },
      { label: "Hollanda",  icon: "🇳🇱" },
      { label: "İsveç",     icon: "🇸🇪" },
      { label: "BAE",       icon: "🇦🇪" },
      { label: "Diğer",     icon: "🌍" },
    ],
  },
  {
    key: "timeFrame",
    question: "Ne zaman tedavi olmayı düşünüyorsunuz?",
    type: "grid",
    options: [
      { label: "1 ay içinde",  icon: "⚡" },
      { label: "3 ay içinde",  icon: "📅" },
      { label: "6 ay içinde",  icon: "🗓️" },
      { label: "Esnek",        icon: "🤔" },
    ],
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setOnboardingData } = useApp();

  const current = STEPS[step];

  const select = async (value) => {
    const newAnswers = { ...answers, [current.key]: value };
    setAnswers(newAnswers);

    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      // Last step — fetch results
      setLoading(true);
      try {
        const data = await api.onboarding({
          treatmentType: newAnswers.treatmentType || "",
          budget: newAnswers.budget || "",
          country: newAnswers.country || "",
          timeFrame: newAnswers.timeFrame || "",
          language: "tr",
        });
        setOnboardingData({ ...newAnswers, results: data });
        navigate("/clinics?onboarding=1");
      } catch {
        navigate("/clinics");
      } finally { setLoading(false); }
    }
  };

  const progress = ((step) / STEPS.length) * 100;

  return (
    <div className="onb-page">
      <div className="onb-card">
        <div className="onb-progress-bar">
          <div className="onb-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="onb-step-label">Adım {step + 1} / {STEPS.length}</div>
        <h2 className="onb-question">{current.question}</h2>

        {loading ? (
          <div className="onb-loading">
            <div className="onb-spinner" />
            <p>AI klinikler eşleştiriyor...</p>
          </div>
        ) : (
          <div className="onb-options">
            {current.options.map((o) => (
              <button
                key={o.label}
                className={`onb-option ${answers[current.key] === o.label ? "selected" : ""}`}
                onClick={() => select(o.label)}
              >
                <span className="onb-option-icon">{o.icon}</span>
                <span>{o.label}</span>
              </button>
            ))}
          </div>
        )}

        {step > 0 && !loading && (
          <button className="onb-back" onClick={() => setStep((s) => s - 1)}>← Geri</button>
        )}
        <button className="onb-skip" onClick={() => navigate("/clinics")}>Atla</button>
      </div>
    </div>
  );
}
