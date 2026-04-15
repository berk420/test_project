import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useApp } from "../context/AppContext";
import "./ComparePage.css";

const COMPARE_FIELDS = [
  { label: "Şehir",         key: "city"           },
  { label: "Kategori",      key: "categoryName"   },
  { label: "Puan",          key: "rating",         format: (v) => `★ ${v}` },
  { label: "Yorum Sayısı",  key: "reviewCount",    format: (v) => `${v} yorum` },
  { label: "Fiyat Aralığı", key: "_price",         custom: (c) => c.minPrice ? `$${c.minPrice} – $${c.maxPrice}` : "–" },
  { label: "Ortalama Dönüş",key: "avgResponseTime" },
  { label: "Toplam Hasta",  key: "totalPatients",  format: (v) => v?.toLocaleString() || "–" },
  { label: "Verified",      key: "isVerified",     format: (v) => v ? "✅ Evet" : "❌ Hayır" },
  { label: "Premium",       key: "isPremium",      format: (v) => v ? "💎 Evet" : "–" },
];

export default function ComparePage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { addToCompare, clearCompare } = useApp();
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiSuggestion, setAiSuggestion] = useState("");

  const ids = (params.get("ids") || "").split(",").map(Number).filter(Boolean);

  useEffect(() => {
    if (!ids.length) { setLoading(false); return; }
    Promise.all(ids.map((id) => {
      const clinic = null;
      return api.getClinics({ pageSize: 100 })
        .then((d) => d.items.find((c) => c.id === id))
        .catch(() => null);
    }))
      .then((results) => {
        const found = results.filter(Boolean);
        setClinics(found);
        if (found.length >= 2) generateAiSuggestion(found);
      })
      .finally(() => setLoading(false));
  }, [params.get("ids")]);

  const generateAiSuggestion = (list) => {
    const best = list.reduce((a, b) => (a.rating > b.rating ? a : b));
    setAiSuggestion(
      `AI Önerisi: ${best.name} — en yüksek puana (${best.rating}★) sahip ve ${best.patientCountries?.join(", ")} gibi ülkelerden hastalara hizmet vermektedir. ` +
      `Ortalama dönüş süresi ${best.avgResponseTime} olup ${best.isVerified ? "platform tarafından doğrulanmıştır" : "doğrulama beklenmektedir"}.`
    );
  };

  if (loading) return <div className="cmp-loading">Klinikler yükleniyor...</div>;
  if (!clinics.length) return (
    <div className="cmp-empty">
      <p>Karşılaştırılacak klinik bulunamadı.</p>
      <button onClick={() => navigate("/clinics")}>Kliniklere Dön</button>
    </div>
  );

  return (
    <div className="cmp-page">
      <div className="cmp-header">
        <button className="cmp-back" onClick={() => navigate(-1)}>← Geri</button>
        <h1>Klinik Karşılaştırma</h1>
        <span className="cmp-count">{clinics.length} klinik</span>
      </div>

      <div className="cmp-wrap">
        {/* Clinic headers */}
        <table className="cmp-table">
          <thead>
            <tr>
              <th className="cmp-row-label" />
              {clinics.map((c) => (
                <th key={c.id} className="cmp-clinic-head">
                  <img src={c.imageUrl} alt={c.name} className="cmp-clinic-img" />
                  <div className="cmp-clinic-name">{c.name}</div>
                  {c.badge && <span className="cmp-badge">{c.badge}</span>}
                  <button className="cmp-detail-btn" onClick={() => navigate(`/clinic/${c.slug}`)}>
                    Detay →
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARE_FIELDS.map((field) => (
              <tr key={field.key}>
                <td className="cmp-row-label">{field.label}</td>
                {clinics.map((c) => {
                  let val;
                  if (field.custom) val = field.custom(c);
                  else {
                    const raw = c[field.key];
                    val = field.format ? field.format(raw) : (raw || "–");
                  }
                  return <td key={c.id} className="cmp-cell">{val}</td>;
                })}
              </tr>
            ))}

            {/* Services */}
            <tr>
              <td className="cmp-row-label">Hizmetler</td>
              {clinics.map((c) => (
                <td key={c.id} className="cmp-cell">
                  <div className="cmp-services">
                    {c.services?.map((s) => <span key={s} className="cmp-service-tag">{s}</span>)}
                  </div>
                </td>
              ))}
            </tr>

            {/* Countries */}
            <tr>
              <td className="cmp-row-label">Hasta Ülkeleri</td>
              {clinics.map((c) => (
                <td key={c.id} className="cmp-cell">
                  {c.patientCountries?.join(", ") || "–"}
                </td>
              ))}
            </tr>

            {/* CTA */}
            <tr>
              <td className="cmp-row-label" />
              {clinics.map((c) => (
                <td key={c.id} className="cmp-cell">
                  <button className="cmp-cta-btn" onClick={() => navigate(`/clinic/${c.slug}`)}>
                    Teklif Al
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {aiSuggestion && (
        <div className="cmp-ai-box">
          <span className="cmp-ai-icon">🤖</span>
          <p>{aiSuggestion}</p>
        </div>
      )}
    </div>
  );
}
