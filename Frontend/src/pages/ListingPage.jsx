import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useApp } from "../context/AppContext";
import ClinicCard from "../components/ClinicCard";
import "./ListingPage.css";

const CITIES = ["İstanbul", "Ankara", "İzmir", "Antalya"];

export default function ListingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { compareList, addToCompare, removeFromCompare, onboardingData } = useApp();

  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [matchScores, setMatchScores] = useState({});

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") || "");
  const [city, setCity] = useState("");
  const [sigorta, setSigorta] = useState("");
  const [randevu, setRandevu] = useState("");
  const [verified, setVerified] = useState("");
  const [sortBy, setSortBy] = useState("featured"); // featured | rating | price_asc | price_desc
  const [page, setPage] = useState(1);

  useEffect(() => {
    Promise.all([api.getCategories(), api.getFilters()])
      .then(([cats, fils]) => { setCategories(cats); setFilters(fils.filter((f) => f.isVisible)); })
      .catch(() => {});
  }, []);

  const fetchClinics = useCallback(() => {
    setLoading(true);
    api.getClinics({
      search: search || undefined,
      categoryId: categoryId || undefined,
      city: city || undefined,
      sigorta: sigorta || undefined,
      randevu: randevu || undefined,
      verified: verified || undefined,
      page,
    })
      .then((data) => {
        let items = data.items || [];
        // Client-side sort
        if (sortBy === "rating")      items = [...items].sort((a, b) => b.rating - a.rating);
        if (sortBy === "price_asc")   items = [...items].sort((a, b) => a.minPrice - b.minPrice);
        if (sortBy === "price_desc")  items = [...items].sort((a, b) => b.maxPrice - a.maxPrice);
        setClinics(items);
        setTotal(data.total);
        // If onboarding data, compute match scores
        if (onboardingData) {
          const scores = {};
          items.forEach((c) => {
            let s = 50;
            if (c.isVerified) s += 8;
            if (c.isPremium) s += 10;
            if (c.rating >= 4.7) s += 12;
            if (onboardingData.preferredCity && c.city === onboardingData.preferredCity) s += 10;
            if (onboardingData.country && c.patientCountries?.some((p) => p.includes(onboardingData.country))) s += 8;
            scores[c.id] = Math.min(s, 99);
          });
          setMatchScores(scores);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, categoryId, city, sigorta, randevu, verified, page, sortBy, onboardingData]);

  useEffect(() => { fetchClinics(); }, [fetchClinics]);

  const resetFilters = () => {
    setSearch(""); setCategoryId(""); setCity(""); setSigorta(""); setRandevu(""); setVerified(""); setSortBy("featured"); setPage(1);
  };

  const toggleCompare = (clinic) => {
    if (compareList.find((c) => c.id === clinic.id)) removeFromCompare(clinic.id);
    else addToCompare(clinic);
  };

  const totalPages = Math.ceil(total / 9);

  return (
    <div className="listing-page">
      {/* Hero */}
      <div className="listing-hero">
        <h1>Global Klinik ve Sağlık Merkezi Rehberi</h1>
        <p>Türkiye'nin önde gelen kliniklerini karşılaştırın, fiyat alın ve güvenle sağlık turizminizi planlayın</p>
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Klinik, tedavi veya şehir ara..."
          />
          {search && <button className="search-clear" onClick={() => { setSearch(""); setPage(1); }}>✕</button>}
        </div>
        {onboardingData && (
          <div className="listing-onboarding-banner">
            🤖 AI eşleştirme aktif: <b>{onboardingData.treatmentType}</b> · {onboardingData.budget}
            <button onClick={() => navigate("/onboarding")} className="listing-re-onboard">Yenile</button>
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        <button className={!categoryId ? "cat-tab active" : "cat-tab"} onClick={() => { setCategoryId(""); setPage(1); }}>
          🏥 Tümü
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            className={categoryId == c.id ? "cat-tab active" : "cat-tab"}
            onClick={() => { setCategoryId(c.id); setPage(1); }}
          >
            {c.icon} {c.name}
          </button>
        ))}
      </div>

      <div className="listing-body">
        {/* Filters Sidebar */}
        <aside className="filters-sidebar">
          <div className="filters-header">
            <span>Filtreler</span>
            <button onClick={resetFilters}>Temizle</button>
          </div>

          <div className="filter-group">
            <label>Şehir</label>
            <select value={city} onChange={(e) => { setCity(e.target.value); setPage(1); }}>
              <option value="">Tüm Şehirler</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {filters.filter((f) => f.type === "select" && f.key !== "city").map((f) => (
            <div key={f.id} className="filter-group">
              <label>{f.name}</label>
              <select
                value={f.key === "Sigorta" ? sigorta : randevu}
                onChange={(e) => { setPage(1); if (f.key === "Sigorta") setSigorta(e.target.value); else setRandevu(e.target.value); }}
              >
                <option value="">Tümü</option>
                {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}

          <div className="filter-group">
            <label className="checkbox-label">
              <input type="checkbox" checked={verified === "true"} onChange={(e) => { setVerified(e.target.checked ? "true" : ""); setPage(1); }} />
              Sadece Onaylı
            </label>
          </div>

          <div className="filter-group">
            <label>Sıralama</label>
            <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }}>
              <option value="featured">Öne Çıkan</option>
              <option value="rating">Puana Göre</option>
              <option value="price_asc">Fiyat (Düşük→Yüksek)</option>
              <option value="price_desc">Fiyat (Yüksek→Düşük)</option>
            </select>
          </div>

          <button className="filter-ai-btn" onClick={() => navigate("/onboarding")}>
            🤖 AI ile Eşleş
          </button>
        </aside>

        {/* Clinics Grid */}
        <main className="clinics-area">
          <div className="results-bar">
            <span>{loading ? "Yükleniyor..." : `${total} klinik bulundu`}</span>
            {compareList.length > 0 && (
              <button className="results-compare-btn" onClick={() => navigate(`/compare?ids=${compareList.map((c) => c.id).join(",")}`)}>
                ⚖️ {compareList.length} kliniği karşılaştır →
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid-loader">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton-card" />)}
            </div>
          ) : clinics.length === 0 ? (
            <div className="empty-state">
              <span>🔍</span>
              <p>Aramanızla eşleşen klinik bulunamadı.</p>
              <button onClick={resetFilters}>Filtreleri Temizle</button>
            </div>
          ) : (
            <div className="clinics-grid">
              {clinics.map((c) => (
                <ClinicCard
                  key={c.id}
                  clinic={c}
                  matchScore={matchScores[c.id] || 0}
                  isInCompare={!!compareList.find((x) => x.id === c.id)}
                  onCompareToggle={toggleCompare}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>← Önceki</button>
              <span>{page} / {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Sonraki →</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
