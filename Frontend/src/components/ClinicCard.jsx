import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import "./ClinicCard.css";

export default function ClinicCard({ clinic }) {
  const navigate = useNavigate();

  const handleClick = async () => {
    await api.trackClick(clinic.id).catch(() => {});
    navigate(`/clinic/${clinic.slug}`);
  };

  return (
    <div className="clinic-card" onClick={handleClick}>
      <div className="card-img-wrap">
        <img src={clinic.imageUrl} alt={clinic.name} className="card-img" loading="lazy" />
        <div className="card-badges">
          {clinic.isFeatured && <span className="badge badge-featured">⭐ Öne Çıkan</span>}
          {clinic.isVerified && <span className="badge badge-verified">✓ Onaylı</span>}
        </div>
      </div>

      <div className="card-body">
        <div className="card-category">{clinic.categoryName}</div>
        <h3 className="card-title">{clinic.name}</h3>
        <p className="card-location">📍 {clinic.district}, {clinic.city}</p>

        <div className="card-rating">
          <span className="stars">{"★".repeat(Math.round(clinic.rating))}{"☆".repeat(5 - Math.round(clinic.rating))}</span>
          <span className="rating-num">{clinic.rating.toFixed(1)}</span>
          <span className="review-count">({clinic.reviewCount} değerlendirme)</span>
        </div>

        <p className="card-desc">{clinic.description.slice(0, 110)}...</p>

        <div className="card-tags">
          {clinic.tags.slice(0, 3).map(t => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      </div>

      <div className="card-footer">
        <span className="card-phone">📞 {clinic.phone}</span>
        <button className="card-btn">Detay →</button>
      </div>
    </div>
  );
}
