import { useState } from "react";
import { api } from "../api/client";
import { useNavigate } from "react-router-dom";
import "./SecondOpinion.css";

export default function SecondOpinion({ clinic }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const ask = async () => {
    setLoading(true);
    try {
      const data = await api.secondOpinion({
        selectedClinicId: clinic.id,
        treatmentType: clinic.services?.[0] || "",
      });
      setResult(data);
      setOpen(true);
    } catch {/* ignore */}
    finally { setLoading(false); }
  };

  return (
    <div className="sop-wrap">
      {!open ? (
        <button className="sop-trigger" onClick={ask} disabled={loading}>
          {loading ? "Yükleniyor..." : "🔄 Alternatif görüş al"}
        </button>
      ) : (
        <div className="sop-panel">
          <div className="sop-head">
            <span>💡 {result?.message}</span>
            <button className="sop-close" onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="sop-list">
            {result?.alternativeClinics?.map((c) => (
              <div key={c.clinicId} className="sop-item" onClick={() => navigate(`/clinic/${c.slug}`)}>
                <img src={c.imageUrl} alt={c.clinicName} className="sop-img" />
                <div className="sop-info">
                  <div className="sop-name">{c.clinicName}</div>
                  <div className="sop-city">{c.city}</div>
                  <div className="sop-score">%{c.matchScore} uygun</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
