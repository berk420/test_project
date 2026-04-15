import { useEffect, useState } from "react";
import "./FomoBadge.css";

export default function FomoBadge({ clinic }) {
  const [viewers, setViewers] = useState(Math.floor(Math.random() * 8) + 3);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewers((v) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        return Math.max(2, Math.min(20, v + delta));
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!clinic) return null;
  return (
    <div className="fomo-wrap">
      <div className="fomo-viewers">
        <span className="fomo-dot" />
        <span><b>{viewers}</b> kişi şu an bu sayfayı inceliyor</span>
      </div>
      {clinic.badge === "popular" && (
        <div className="fomo-trend">🔥 Bu hafta trend</div>
      )}
    </div>
  );
}
