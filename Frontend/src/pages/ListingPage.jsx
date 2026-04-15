import { useEffect, useState, useCallback } from "react";
import { api } from "../api/client";
import ClinicCard from "../components/ClinicCard";
import "./ListingPage.css";

const CITIES = ["İstanbul", "Ankara", "İzmir"];

export default function ListingPage() {
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [city, setCity] = useState("");
  const [sigorta, setSigorta] = useState("");
  const [randevu, setRandevu] = useState("");
  const [verified, setVerified] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    Promise.all([api.getCategories(), api.getFilters()])
      .then(([cats, fils]) => { setCategories(cats); setFilters(fils.filter(f => f.isVisible)); })
      .catch(() => {});
  }, []);

  const fetchClinics = useCallback(() => {
    setLoading(true);
    api.getClinics({ search, categoryId: categoryId || undefined, city: city || undefined, sigorta: sigorta || undefined, randevu: randevu || undefined, verified: verified || undefined, page })
      .then(data => { setClinics(data.items); setTotal(data.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, categoryId, city, sigorta, randevu, verified, page]);

  useEffect(() => { fetchClinics(); }, [fetchClinics]);

  const resetFilters = () => {
    setSearch(""); setCategoryId(""); setCity(""); setSigorta(""); setRandevu(""); setVerified(""); setPage(1);
  };

  const totalPages = Math.ceil(total / 9);

  return (
    <div className="listing-page">
      {/* Hero */}
      <div className="listing-hero">
        <h1>Klinik ve Sağlık Merkezi Bul</h1>
        <p>Türkiye'nin dört bir yanındaki onaylı klinik ve sağlık merkezlerini keşfedin</p>
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Klinik adı, hizmet veya etiket ara..."
          />
          {search && <button className="search-clear" onClick={() => setSearch("")}>✕</button>}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        <button className={!categoryId ? "cat-tab active" : "cat-tab"} onClick={() => { setCategoryId(""); setPage(1); }}>
          🏥 Tümü
        </button>
        {categories.map(c => (
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
            <select value={city} onChange={e => { setCity(e.target.value); setPage(1); }}>
              <option value="">Tüm Şehirler</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {filters.filter(f => f.type === "select" && f.key !== "city").map(f => (
            <div key={f.id} className="filter-group">
              <label>{f.name}</label>
              <select
                value={f.key === "Sigorta" ? sigorta : randevu}
                onChange={e => {
                  setPage(1);
                  if (f.key === "Sigorta") setSigorta(e.target.value);
                  else setRandevu(e.target.value);
                }}
              >
                <option value="">Tümü</option>
                {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}

          <div className="filter-group">
            <label className="checkbox-label">
              <input type="checkbox" checked={verified === "true"} onChange={e => { setVerified(e.target.checked ? "true" : ""); setPage(1); }} />
              Sadece Onaylı Klinikler
            </label>
          </div>
        </aside>

        {/* Clinics Grid */}
        <main className="clinics-area">
          <div className="results-bar">
            <span>{loading ? "Yükleniyor..." : `${total} klinik bulundu`}</span>
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
              {clinics.map(c => <ClinicCard key={c.id} clinic={c} />)}
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Önceki</button>
              <span>{page} / {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Sonraki →</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
