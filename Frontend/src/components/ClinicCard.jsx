import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useApp } from "../context/AppContext";
import SmartMatchScore from "./SmartMatchScore";
import "./ClinicCard.css";

const BADGE_CONFIG = {
  popular:       { label: "🔥 Popüler",      cls: "badge-popular"   },
  premium:       { label: "💎 Premium",       cls: "badge-premium"   },
  verified:      { label: "✓ Onaylı",         cls: "badge-verified"  },
  "fast-response":{ label: "⚡ Hızlı Dönüş", cls: "badge-fast"      },
};

export default function ClinicCard({ clinic, matchScore, onCompareToggle, isInCompare }) {
  const navigate = useNavigate();
  const { user, toggleFavorite } = useApp?.() || {};

  const handleClick = async () => {
    await api.trackClick(clinic.id).catch(() => {});
    navigate(`/clinic/${clinic.slug}`);
  };

  const badgeCfg = clinic.badge ? BADGE_CONFIG[clinic.badge] : null;

  return (
    <div className="clinic-card">
      <div className="card-img-wrap" onClick={handleClick}>
        <img src={clinic.imageUrl} alt={clinic.name} className="card-img" loading="lazy" />
        <div className="card-badges">
          {badgeCfg && <span className={`badge ${badgeCfg.cls}`}>{badgeCfg.label}</span>}
          {clinic.isFeatured && !clinic.badge && <span className="badge badge-featured">⭐ Öne Çıkan</span>}
          {clinic.isVerified && !clinic.badge && <span className="badge badge-verified">✓ Onaylı</span>}
        </div>
        {clinic.campaignBadge && (
          <div className="card-campaign-tag">{clinic.campaignBadge}</div>
        )}
      </div>

      <div className="card-body" onClick={handleClick}>
        <div className="card-header-row">
          <span className="card-category">{clinic.categoryName}</span>
          <span className="card-country">🌍 {clinic.country || "Türkiye"}</span>
        </div>
        <h3 className="card-title">{clinic.name}</h3>
        <p className="card-location">📍 {clinic.district}, {clinic.city}</p>

        <div className="card-rating">
          <span className="stars">{"★".repeat(Math.round(clinic.rating))}{"☆".repeat(5 - Math.round(clinic.rating))}</span>
          <span className="rating-num">{clinic.rating?.toFixed(1)}</span>
          <span className="review-count">({clinic.reviewCount} yorum)</span>
        </div>

        {clinic.minPrice > 0 && (
          <div className="card-price">
            <span className="card-price-label">Fiyat:</span>
            <span className="card-price-val">${clinic.minPrice.toLocaleString()} – ${clinic.maxPrice.toLocaleString()}</span>
          </div>
        )}

        <p className="card-desc">{clinic.description?.slice(0, 100)}...</p>

        <div className="card-tags">
          {clinic.tags?.slice(0, 3).map((t) => <span key={t} className="tag">{t}</span>)}
        </div>

        {matchScore > 0 && <SmartMatchScore score={matchScore} compact />}

        {clinic.avgResponseTime && (
          <div className="card-response">⚡ {clinic.avgResponseTime} ortalama dönüş</div>
        )}
      </div>

      <div className="card-footer">
        <button
          className={`card-compare-btn ${isInCompare ? "active" : ""}`}
          onClick={(e) => { e.stopPropagation(); onCompareToggle?.(clinic); }}
          title="Karşılaştırmaya ekle"
        >
          {isInCompare ? "✓ Karşılaştırılıyor" : "⚖️ Karşılaştır"}
        </button>
        <button className="card-btn" onClick={handleClick}>Detay →</button>
      </div>
    </div>
  );
}
