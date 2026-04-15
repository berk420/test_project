import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import ClinicCard from "../components/ClinicCard";
import "./HomePage.css";

const TREATMENTS = ["Saç Ekimi", "Diş İmplantı", "Göz Lazeri", "Rinoplasti", "Botoks", "Diz Protezi", "Ortodonti", "Liposuction"];

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [cityPages, setCityPages] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
    api.getClinics({ featured: true, pageSize: 6 }).then((d) => setFeatured(d.items || [])).catch(() => {});
    api.getCampaigns().then(setCampaigns).catch(() => {});
    api.getBlogPosts({ pageSize: 3 }).then((d) => setBlogPosts(d.items || [])).catch(() => {});
    api.getCityPages().then(setCityPages).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/clinics?search=${encodeURIComponent(search)}`);
  };

  return (
    <div className="home">
      {/* ── HERO ── */}
      <section className="home-hero">
        <div className="home-hero-content">
          <div className="home-hero-badge">🌍 Global Sağlık Marketplace</div>
          <h1>Dünya Standartlarında<br />Sağlık Hizmetleri</h1>
          <p>AI destekli platform ile doğru kliniği bulun, tedavi maliyetini öğrenin ve güvenle yola çıkın.</p>
          <form className="home-search" onSubmit={handleSearch}>
            <span className="home-search-icon">🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tedavi veya klinik adı arayın..."
            />
            <button type="submit">Ara</button>
          </form>
          <div className="home-quick-tags">
            {TREATMENTS.map((t) => (
              <button key={t} onClick={() => navigate(`/clinics?search=${encodeURIComponent(t)}`)} className="home-tag">
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="home-hero-stats">
          <div className="hero-stat"><div className="hero-stat-num">500+</div><div className="hero-stat-label">Klinik</div></div>
          <div className="hero-stat"><div className="hero-stat-num">50K+</div><div className="hero-stat-label">Hasta</div></div>
          <div className="hero-stat"><div className="hero-stat-num">40+</div><div className="hero-stat-label">Ülke</div></div>
          <div className="hero-stat"><div className="hero-stat-num">4.8★</div><div className="hero-stat-label">Ort. Puan</div></div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="home-section">
        <div className="home-section-inner">
          <h2 className="home-section-title">Nasıl Çalışır?</h2>
          <div className="home-steps">
            {[
              { icon: "🤖", title: "AI ile Eşleştir",   desc: "Şikayetinizi yazın, AI uygun tedaviyi ve klinikleri bulur" },
              { icon: "⚖️", title: "Karşılaştır",        desc: "Fiyat, puan ve hizmetleri yan yana karşılaştırın" },
              { icon: "📋", title: "Teklif Alın",        desc: "Seçtiğiniz klinikten ücretsiz teklif alın" },
              { icon: "✈️", title: "Tedavinize Başlayın",desc: "Güvenle tedavinizi yaptırın" },
            ].map((s, i) => (
              <div key={i} className="home-step">
                <div className="home-step-icon">{s.icon}</div>
                <div className="home-step-num">{i + 1}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="home-section home-section-gray">
        <div className="home-section-inner">
          <h2 className="home-section-title">Tedavi Kategorileri</h2>
          <div className="home-cats">
            {categories.map((c) => (
              <button
                key={c.id}
                className="home-cat-card"
                style={{ borderColor: c.color }}
                onClick={() => navigate(`/clinics?categoryId=${c.id}`)}
              >
                <span className="home-cat-icon">{c.icon}</span>
                <span className="home-cat-name">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAMPAIGNS ── */}
      {campaigns.length > 0 && (
        <section className="home-section">
          <div className="home-section-inner">
            <h2 className="home-section-title">🔥 Aktif Kampanyalar</h2>
            <div className="home-campaigns">
              {campaigns.map((c) => (
                <div key={c.id} className="home-campaign-card">
                  <div className="home-campaign-badge">{c.badgeText}</div>
                  <div className="home-campaign-clinic">{c.clinicName}</div>
                  <div className="home-campaign-title">{c.title}</div>
                  <div className="home-campaign-desc">{c.description}</div>
                  <div className="home-campaign-until">
                    Bitiş: {new Date(c.endDate).toLocaleDateString("tr-TR")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURED CLINICS ── */}
      {featured.length > 0 && (
        <section className="home-section home-section-gray">
          <div className="home-section-inner">
            <div className="home-section-header">
              <h2 className="home-section-title">Öne Çıkan Klinikler</h2>
              <button className="home-see-all" onClick={() => navigate("/clinics")}>Tümünü Gör →</button>
            </div>
            <div className="home-clinics-grid">
              {featured.map((c) => <ClinicCard key={c.id} clinic={c} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── CITIES ── */}
      {cityPages.length > 0 && (
        <section className="home-section">
          <div className="home-section-inner">
            <h2 className="home-section-title">Popüler Destinasyonlar</h2>
            <div className="home-cities">
              {cityPages.map((c) => (
                <div
                  key={c.id}
                  className="home-city-card"
                  onClick={() => navigate(`/blog/cities/${c.slug}`)}
                  style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.35),rgba(0,0,0,.55)), url(${c.imageUrl})` }}
                >
                  <div className="home-city-name">{c.city}</div>
                  <div className="home-city-count">{c.clinicCount} klinik</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── TRUST SECTION ── */}
      <section className="home-section home-section-blue">
        <div className="home-section-inner home-trust">
          <div className="home-trust-text">
            <h2>Neden Medtravio?</h2>
            <ul className="home-trust-list">
              <li>✅ Tüm klinikler doğrulanmış ve incelenmiş</li>
              <li>🔒 Lead hiçbir zaman direkt kliniğe gitmez — admin yönetimi</li>
              <li>🤖 AI destekli eşleştirme ve fiyat tahmini</li>
              <li>🌍 40+ ülkeden hasta deneyimi</li>
              <li>📊 Şeffaf klinik performans skorları</li>
            </ul>
          </div>
          <div className="home-trust-cta">
            <h3>Hemen Başlayın</h3>
            <p>AI asistanımız sizi doğru kliniğe yönlendirsin</p>
            <button onClick={() => navigate("/clinics")} className="home-cta-btn">Klinik Ara</button>
            <button onClick={() => navigate("/onboarding")} className="home-cta-btn home-cta-secondary">AI ile Eşleş</button>
          </div>
        </div>
      </section>

      {/* ── BLOG ── */}
      {blogPosts.length > 0 && (
        <section className="home-section">
          <div className="home-section-inner">
            <div className="home-section-header">
              <h2 className="home-section-title">Rehberler & Makaleler</h2>
              <button className="home-see-all" onClick={() => navigate("/blog")}>Tümünü Gör →</button>
            </div>
            <div className="home-blog-grid">
              {blogPosts.map((p) => (
                <div key={p.id} className="home-blog-card" onClick={() => navigate(`/blog/${p.slug}`)}>
                  <img src={p.coverImageUrl} alt={p.title} />
                  <div className="home-blog-body">
                    <div className="home-blog-cat">{p.category}</div>
                    <div className="home-blog-title">{p.title}</div>
                    <div className="home-blog-summary">{p.summary}</div>
                    <div className="home-blog-meta">{p.author} · {p.viewCount.toLocaleString()} görüntülenme</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
