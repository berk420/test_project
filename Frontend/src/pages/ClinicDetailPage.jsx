import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useApp } from "../context/AppContext";
import LeadForm from "../components/LeadForm";
import TrustBadges from "../components/TrustBadges";
import FomoBadge from "../components/FomoBadge";
import SecondOpinion from "../components/SecondOpinion";
import SmartMatchScore from "../components/SmartMatchScore";
import "./ClinicDetailPage.css";

export default function ClinicDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, compareList, addToCompare, removeFromCompare, onboardingData } = useApp();

  const [clinic, setClinic] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [casePhotos, setCasePhotos] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [priceRanges, setPriceRanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [galleryIdx, setGalleryIdx] = useState(0);

  useEffect(() => {
    api.getClinic(slug)
      .then((c) => {
        setClinic(c);
        // parallel extra data
        Promise.all([
          api.getReviews(c.id),
          api.getCasePhotos({ clinicId: c.id }),
          api.getClinicCampaigns(c.id),
          api.getClinicPriceRanges(c.id),
        ]).then(([rev, photos, camp, prices]) => {
          setReviews(rev || []);
          setCasePhotos(photos || []);
          setCampaigns(camp || []);
          setPriceRanges(prices || []);
        }).catch(() => {});

        // check favorite
        if (user) {
          api.getFavorites(user.id).then((favs) => {
            setIsFav(favs.some((f) => f.id === c.id));
          }).catch(() => {});
        }
      })
      .catch(() => setError("Klinik bulunamadı."))
      .finally(() => setLoading(false));
  }, [slug, user]);

  const toggleFav = async () => {
    if (!user) { navigate("/login"); return; }
    await api.toggleFavorite(user.id, clinic.id);
    setIsFav((v) => !v);
  };

  const isInCompare = compareList.some((c) => c.id === clinic?.id);
  const toggleCompare = () => isInCompare ? removeFromCompare(clinic.id) : addToCompare(clinic);

  // compute match score from onboarding
  const matchScore = onboardingData && clinic ? (() => {
    let s = 50;
    if (clinic.isVerified) s += 8;
    if (clinic.isPremium) s += 10;
    if (clinic.rating >= 4.7) s += 12;
    if (onboardingData.country && clinic.patientCountries?.some((p) => p.includes(onboardingData.country))) s += 8;
    return Math.min(s, 99);
  })() : 0;

  if (loading) return <div className="detail-loader"><div className="loader" /><p>Yükleniyor...</p></div>;
  if (error || !clinic) return (
    <div className="detail-error">
      <span>⚠️</span><p>{error || "Klinik bulunamadı."}</p>
      <button onClick={() => navigate("/clinics")}>← Geri Dön</button>
    </div>
  );

  const allImages = [clinic.imageUrl, ...(clinic.galleryUrls || [])].filter(Boolean);

  return (
    <div className="detail-page">
      {/* ── HERO ── */}
      <div className="detail-hero" style={{ backgroundImage: `url(${allImages[galleryIdx] || clinic.imageUrl})` }}>
        <div className="detail-hero-overlay">
          <div className="detail-hero-top">
            <button className="back-btn" onClick={() => navigate(-1)}>← Geri</button>
            <div className="detail-hero-actions">
              <button className={`detail-fav-btn ${isFav ? "active" : ""}`} onClick={toggleFav} title="Favorilere ekle">
                {isFav ? "❤️" : "🤍"}
              </button>
              <button className={`detail-compare-btn ${isInCompare ? "active" : ""}`} onClick={toggleCompare}>
                {isInCompare ? "✓ Karşılaştırılıyor" : "⚖️ Karşılaştır"}
              </button>
            </div>
          </div>
          <div className="detail-hero-content">
            <div className="detail-badges">
              <span className="dbadge">{clinic.categoryName}</span>
              {clinic.isVerified  && <span className="dbadge dbadge-green">✓ Onaylı</span>}
              {clinic.isPremium   && <span className="dbadge dbadge-gold">💎 Premium</span>}
              {clinic.isFeatured  && !clinic.isPremium && <span className="dbadge dbadge-gold">⭐ Öne Çıkan</span>}
            </div>
            <h1>{clinic.name}</h1>
            <p className="detail-location">📍 {clinic.district}, {clinic.city}, {clinic.country}</p>
            <div className="detail-rating-row">
              <span className="dstars">{"★".repeat(Math.round(clinic.rating))}{"☆".repeat(5 - Math.round(clinic.rating))}</span>
              <strong>{clinic.rating?.toFixed(1)}</strong>
              <span>({clinic.reviewCount} yorum)</span>
            </div>
            <FomoBadge clinic={clinic} />
          </div>
        </div>
        {allImages.length > 1 && (
          <div className="detail-gallery-dots">
            {allImages.map((_, i) => (
              <button key={i} className={`gal-dot ${i === galleryIdx ? "active" : ""}`} onClick={() => setGalleryIdx(i)} />
            ))}
          </div>
        )}
      </div>

      {/* ── CAMPAIGNS BANNER ── */}
      {campaigns.length > 0 && (
        <div className="detail-campaign-strip">
          {campaigns.map((c) => (
            <span key={c.id} className="detail-campaign-chip">🎯 {c.title} — {c.badgeText}</span>
          ))}
        </div>
      )}

      <div className="detail-body">
        {/* ── LEFT / MAIN ── */}
        <div className="detail-main">
          {/* Match Score */}
          {matchScore > 0 && (
            <div className="detail-section">
              <SmartMatchScore score={matchScore} />
            </div>
          )}

          {/* Tabs */}
          <div className="detail-tabs">
            {["about", "services", "reviews", "cases", "info"].map((t) => (
              <button key={t} className={`detail-tab ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>
                {t === "about" ? "Hakkında" : t === "services" ? "Hizmetler" : t === "reviews" ? `Yorumlar (${reviews.length})` : t === "cases" ? "Öncesi/Sonrası" : "Bilgiler"}
              </button>
            ))}
          </div>

          {activeTab === "about" && (
            <>
              <section className="detail-section">
                <p className="detail-desc">{clinic.description}</p>
              </section>
              <section className="detail-section">
                <h2>Güven Katmanı</h2>
                <TrustBadges clinic={clinic} />
              </section>
              {clinic.patientCountries?.length > 0 && (
                <section className="detail-section">
                  <h2>Hasta Ülkeleri</h2>
                  <div className="detail-countries">
                    {clinic.patientCountries.map((c) => <span key={c} className="detail-country">{c}</span>)}
                  </div>
                </section>
              )}
              {clinic.videoUrl && (
                <section className="detail-section">
                  <h2>Video</h2>
                  <video src={clinic.videoUrl} controls className="detail-video" />
                </section>
              )}
              <SecondOpinion clinic={clinic} />
            </>
          )}

          {activeTab === "services" && (
            <section className="detail-section">
              <div className="services-grid">
                {clinic.services?.map((s) => (
                  <div key={s} className="service-item"><span className="service-check">✓</span> {s}</div>
                ))}
              </div>
              {priceRanges.length > 0 && (
                <>
                  <h2 style={{ marginTop: 24 }}>Fiyat Aralıkları</h2>
                  <div className="detail-prices">
                    {priceRanges.map((p) => (
                      <div key={p.id} className="detail-price-row">
                        <span className="dpr-treatment">{p.treatmentType}</span>
                        <span className="dpr-range">${p.minPrice.toLocaleString()} – ${p.maxPrice.toLocaleString()} {p.currency}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>
          )}

          {activeTab === "reviews" && (
            <section className="detail-section">
              {reviews.length === 0 ? (
                <p className="detail-no-reviews">Henüz yorum yok.</p>
              ) : (
                <div className="reviews-list">
                  {reviews.map((r) => (
                    <div key={r.id} className="review-card">
                      <div className="review-head">
                        <div className="review-author-info">
                          <div className="review-avatar">{r.authorName?.[0]?.toUpperCase()}</div>
                          <div>
                            <div className="review-author">{r.authorName}</div>
                            <div className="review-country">🌍 {r.authorCountry}</div>
                          </div>
                        </div>
                        <div className="review-right">
                          <div className="review-stars">{"★".repeat(Math.round(r.rating))}{"☆".repeat(5 - Math.round(r.rating))}</div>
                          {r.isVerified && <span className="review-verified">✓ Doğrulandı</span>}
                        </div>
                      </div>
                      <p className="review-text">{r.comment}</p>
                      <div className="review-meta">{r.treatmentType} · {new Date(r.createdAt).toLocaleDateString("tr-TR")}</div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === "cases" && (
            <section className="detail-section">
              {casePhotos.length === 0 ? (
                <p className="detail-no-reviews">Vaka fotoğrafı eklenmemiş.</p>
              ) : (
                <div className="cases-grid">
                  {casePhotos.map((c) => (
                    <div key={c.id} className="case-item">
                      <div className="case-imgs">
                        <div className="case-img-wrap"><span>Öncesi</span><img src={c.beforeUrl} alt="Öncesi" /></div>
                        <div className="case-img-wrap"><span>Sonrası</span><img src={c.afterUrl} alt="Sonrası" /></div>
                      </div>
                      <p className="case-desc">{c.description}</p>
                      <span className="case-treatment">{c.treatmentType}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === "info" && (
            <section className="detail-section">
              {Object.keys(clinic.dynamicFields || {}).length > 0 && (
                <div className="info-grid">
                  {Object.entries(clinic.dynamicFields).map(([k, v]) => (
                    <div key={k} className="info-item">
                      <span className="info-label">{k}</span>
                      <span className="info-value">{v}</span>
                    </div>
                  ))}
                </div>
              )}
              {clinic.tags?.length > 0 && (
                <>
                  <h2 style={{ marginTop: 20 }}>Etiketler</h2>
                  <div className="detail-tags">
                    {clinic.tags.map((t) => <span key={t} className="detail-tag">{t}</span>)}
                  </div>
                </>
              )}
            </section>
          )}
        </div>

        {/* ── ASIDE ── */}
        <aside className="detail-aside">
          {/* Price summary */}
          {clinic.minPrice > 0 && (
            <div className="detail-price-card">
              <div className="dpc-label">Tahmini Fiyat Aralığı</div>
              <div className="dpc-value">${clinic.minPrice.toLocaleString()} – ${clinic.maxPrice.toLocaleString()}</div>
              <div className="dpc-currency">{clinic.priceCurrency}</div>
            </div>
          )}

          {/* Contact */}
          <div className="contact-card">
            <h3>İletişim</h3>
            <div className="contact-row">
              <span>📞</span>
              <a href={`tel:${clinic.phone?.replace(/\s/g, "")}`}>{clinic.phone}</a>
            </div>
            {clinic.whatsApp && (
              <a className="contact-whatsapp" href={`https://wa.me/${clinic.whatsApp?.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer">
                💬 WhatsApp ile Yaz
              </a>
            )}
            {clinic.email && (
              <div className="contact-row">
                <span>✉️</span>
                <a href={`mailto:${clinic.email}`}>{clinic.email}</a>
              </div>
            )}
            {clinic.website && (
              <div className="contact-row">
                <span>🌐</span>
                <a href={clinic.website} target="_blank" rel="noreferrer">{clinic.website.replace("https://","")}</a>
              </div>
            )}
            {clinic.address && (
              <div className="contact-row"><span>📍</span><span>{clinic.address}</span></div>
            )}
          </div>

          {/* Lead Form */}
          <LeadForm clinic={clinic} />

          {/* Map placeholder */}
          {clinic.lat && (
            <div className="detail-map">
              <a href={`https://www.google.com/maps?q=${clinic.lat},${clinic.lng}`} target="_blank" rel="noreferrer" className="detail-map-link">
                🗺️ Google Maps'te Aç
              </a>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
