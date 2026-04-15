import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import LeadForm from "../components/LeadForm";
import "./ClinicDetailPage.css";

export default function ClinicDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getClinic(slug)
      .then(setClinic)
      .catch(() => setError("Klinik bulunamadı."))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="detail-loader">
      <div className="loader"></div>
      <p>Yükleniyor...</p>
    </div>
  );

  if (error || !clinic) return (
    <div className="detail-error">
      <span>⚠️</span>
      <p>{error || "Klinik bulunamadı."}</p>
      <button onClick={() => navigate("/")}>← Geri Dön</button>
    </div>
  );

  return (
    <div className="detail-page">
      {/* Hero */}
      <div className="detail-hero" style={{ backgroundImage: `url(${clinic.imageUrl})` }}>
        <div className="detail-hero-overlay">
          <button className="back-btn" onClick={() => navigate(-1)}>← Geri</button>
          <div className="detail-hero-content">
            <div className="detail-badges">
              <span className="dbadge">{clinic.categoryName}</span>
              {clinic.isVerified && <span className="dbadge dbadge-green">✓ Onaylı</span>}
              {clinic.isFeatured && <span className="dbadge dbadge-gold">⭐ Öne Çıkan</span>}
            </div>
            <h1>{clinic.name}</h1>
            <p className="detail-location">📍 {clinic.district}, {clinic.city}</p>
            <div className="detail-rating">
              <span className="dstars">{"★".repeat(Math.round(clinic.rating))}{"☆".repeat(5 - Math.round(clinic.rating))}</span>
              <strong>{clinic.rating.toFixed(1)}</strong>
              <span>({clinic.reviewCount} değerlendirme)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-body">
        {/* Left Column */}
        <div className="detail-main">
          {/* About */}
          <section className="detail-section">
            <h2>Hakkında</h2>
            <p className="detail-desc">{clinic.description}</p>
          </section>

          {/* Services */}
          <section className="detail-section">
            <h2>Hizmetler</h2>
            <div className="services-grid">
              {clinic.services.map(s => (
                <div key={s} className="service-item">
                  <span className="service-check">✓</span> {s}
                </div>
              ))}
            </div>
          </section>

          {/* Tags */}
          {clinic.tags.length > 0 && (
            <section className="detail-section">
              <h2>Etiketler</h2>
              <div className="detail-tags">
                {clinic.tags.map(t => <span key={t} className="detail-tag">{t}</span>)}
              </div>
            </section>
          )}

          {/* Dynamic Fields */}
          {Object.keys(clinic.dynamicFields).length > 0 && (
            <section className="detail-section">
              <h2>Klinik Bilgileri</h2>
              <div className="info-grid">
                {Object.entries(clinic.dynamicFields).map(([k, v]) => (
                  <div key={k} className="info-item">
                    <span className="info-label">{k}</span>
                    <span className="info-value">{v}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column */}
        <aside className="detail-aside">
          {/* Contact Card */}
          <div className="contact-card">
            <h3>İletişim</h3>
            <div className="contact-row">
              <span>📞</span>
              <a href={`tel:${clinic.phone.replace(/\s/g, "")}`}>{clinic.phone}</a>
            </div>
            {clinic.email && (
              <div className="contact-row">
                <span>✉️</span>
                <a href={`mailto:${clinic.email}`}>{clinic.email}</a>
              </div>
            )}
            {clinic.website && (
              <div className="contact-row">
                <span>🌐</span>
                <a href={clinic.website} target="_blank" rel="noreferrer">{clinic.website.replace("https://", "")}</a>
              </div>
            )}
            {clinic.address && (
              <div className="contact-row">
                <span>📍</span>
                <span>{clinic.address}</span>
              </div>
            )}
          </div>

          {/* Lead Form */}
          <LeadForm clinic={clinic} />
        </aside>
      </div>
    </div>
  );
}
