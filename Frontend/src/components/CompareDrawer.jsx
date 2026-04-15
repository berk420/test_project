import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "./CompareDrawer.css";

export default function CompareDrawer() {
  const { compareList, removeFromCompare, clearCompare } = useApp();
  const navigate = useNavigate();

  if (compareList.length === 0) return null;

  return (
    <div className="cd-wrap">
      <div className="cd-inner">
        <div className="cd-left">
          <span className="cd-title">Karşılaştır ({compareList.length}/3)</span>
          <div className="cd-items">
            {compareList.map((c) => (
              <div key={c.id} className="cd-chip">
                <img src={c.imageUrl} alt={c.name} />
                <span>{c.name}</span>
                <button onClick={() => removeFromCompare(c.id)}>✕</button>
              </div>
            ))}
          </div>
        </div>
        <div className="cd-actions">
          <button className="cd-clear" onClick={clearCompare}>Temizle</button>
          {compareList.length >= 2 && (
            <button
              className="cd-go"
              onClick={() => navigate(`/compare?ids=${compareList.map((c) => c.id).join(",")}`)}
            >
              Karşılaştır →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
