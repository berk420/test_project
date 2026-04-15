import { useEffect, useState, useCallback } from "react";
import { api } from "../api/client";
import "./AdminPage.css";

const STATUS_LABELS = {
  pending: "Beklemede", review: "İncelemede", approved: "Onaylandı",
  assigned: "Atandı", closed: "Kapatıldı"
};
const STATUS_COLORS = {
  pending: "#f59e0b", review: "#8b5cf6", approved: "#3b82f6",
  assigned: "#22c55e", closed: "#64748b"
};
const TIER_COLORS = { hot: "#ef4444", warm: "#f59e0b", cold: "#3b82f6" };

function StatCard({ icon, label, value, sub }) {
  return (
    <div className="stat-card">
      <span className="sc-icon">{icon}</span>
      <div>
        <div className="sc-value">{value}</div>
        <div className="sc-label">{label}</div>
        {sub && <div className="sc-sub">{sub}</div>}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [tab, setTab] = useState("dashboard");

  return (
    <div className="admin-page">
      <div className="admin-sidebar">
        <div className="admin-logo">⚙️ Admin Panel</div>
        {[
          { key: "dashboard",   label: "📊 Dashboard" },
          { key: "leads",       label: "📋 Lead Yönetimi" },
          { key: "campaigns",   label: "🎯 Kampanyalar" },
          { key: "billing",     label: "💳 Faturalar" },
          { key: "performance", label: "🏆 Performans" },
          { key: "fields",      label: "🔧 Alan & Filtreler" },
        ].map((t) => (
          <button
            key={t.key}
            className={tab === t.key ? "sidebar-btn active" : "sidebar-btn"}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {tab === "dashboard"   && <DashboardTab />}
        {tab === "leads"       && <LeadsTab />}
        {tab === "campaigns"   && <CampaignsTab />}
        {tab === "billing"     && <BillingTab />}
        {tab === "performance" && <PerformanceTab />}
        {tab === "fields"      && <FieldsTab />}
      </div>
    </div>
  );
}

/* ─────────────────────── DASHBOARD ─────────────────────── */
function DashboardTab() {
  const [stats, setStats] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getAdminStats(), api.getAdminClinics()])
      .then(([s, c]) => { setStats(s); setClinics(c); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="admin-loader">Yükleniyor...</div>;
  if (!stats) return null;

  return (
    <>
      <h1 className="admin-title">Dashboard</h1>
      <div className="stats-grid">
        <StatCard icon="🏥" label="Toplam Klinik"      value={stats.totalClinics} />
        <StatCard icon="👁️" label="Toplam Görüntüleme"  value={stats.totalViews?.toLocaleString()} />
        <StatCard icon="🖱️" label="Toplam Tıklanma"    value={stats.totalClicks?.toLocaleString()} />
        <StatCard icon="📩" label="Toplam Lead"         value={stats.totalLeads}  sub={`Bugün: ${stats.newLeadsToday} yeni`} />
      </div>

      <div className="admin-section">
        <h2>Lead Durumları</h2>
        <div className="lead-status-bars">
          {stats.leadsByStatus?.map((s) => {
            const pct = stats.totalLeads ? Math.round(s.count / stats.totalLeads * 100) : 0;
            return (
              <div key={s.status} className="status-bar-row">
                <span className="status-name" style={{ color: STATUS_COLORS[s.status] || "#94a3b8" }}>
                  {STATUS_LABELS[s.status] || s.status}
                </span>
                <div className="status-bar-track">
                  <div className="status-bar-fill" style={{ width: `${pct}%`, background: STATUS_COLORS[s.status] || "#334155" }} />
                </div>
                <span className="status-count">{s.count} ({pct}%)</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="admin-section">
        <h2>Klinik İstatistikleri</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Klinik</th><th>Kategori</th><th>Şehir</th><th>Görüntüleme</th><th>Tıklanma</th><th>Lead</th><th>Durum</th></tr>
            </thead>
            <tbody>
              {clinics.map((c) => (
                <tr key={c.id}>
                  <td className="td-bold">{c.name}</td>
                  <td>{c.categoryName}</td>
                  <td>{c.city}</td>
                  <td>{c.views?.toLocaleString()}</td>
                  <td>{c.clicks?.toLocaleString()}</td>
                  <td><span className="td-leads">{c.leads}</span></td>
                  <td>
                    {c.isVerified && <span className="pill pill-green">Onaylı</span>}
                    {c.isFeatured && <span className="pill pill-gold">Öne Çıkan</span>}
                    {c.isPremium  && <span className="pill pill-purple">Premium</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────── LEADS ─────────────────────── */
function LeadsTab() {
  const [leads, setLeads] = useState([]);
  const [leadFilter, setLeadFilter] = useState("");
  const [tierFilter, setTierFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedLead, setExpandedLead] = useState(null);
  const [notes, setNotes] = useState({});
  const [noteInput, setNoteInput] = useState("");
  const [clinics, setClinics] = useState([]);

  const fetchLeads = useCallback(() => {
    setLoading(true);
    api.getAdminLeads({
      status: leadFilter || undefined,
      tier: tierFilter || undefined,
    })
      .then(setLeads)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [leadFilter, tierFilter]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);
  useEffect(() => { api.getAdminClinics().then(setClinics).catch(() => {}); }, []);

  const changeStatus = async (id, status) => {
    await api.updateLeadStatus(id, status).catch(() => {});
    setLeads((ls) => ls.map((l) => l.id === id ? { ...l, status } : l));
  };

  const assignLead = async (id, clinicId) => {
    if (!clinicId) return;
    await api.assignLead(id, { clinicId: +clinicId }).catch(() => {});
    fetchLeads();
  };

  const openNotes = async (lead) => {
    if (expandedLead?.id === lead.id) { setExpandedLead(null); return; }
    setExpandedLead(lead);
    const data = await api.getLeadNotes(lead.id).catch(() => []);
    setNotes((n) => ({ ...n, [lead.id]: data || [] }));
  };

  const addNote = async (leadId) => {
    if (!noteInput.trim()) return;
    await api.addLeadNote(leadId, { content: noteInput, authorName: "Admin" }).catch(() => {});
    const data = await api.getLeadNotes(leadId).catch(() => []);
    setNotes((n) => ({ ...n, [leadId]: data || [] }));
    setNoteInput("");
  };

  return (
    <>
      <div className="admin-title-row">
        <h1 className="admin-title">Lead Yönetimi</h1>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <div className="lead-filter-tabs">
            {["", "pending", "review", "approved", "assigned", "closed"].map((s) => (
              <button
                key={s}
                className={leadFilter === s ? "lf-tab active" : "lf-tab"}
                onClick={() => setLeadFilter(s)}
                style={s && leadFilter === s ? { background: STATUS_COLORS[s], borderColor: STATUS_COLORS[s] } : {}}
              >
                {s ? STATUS_LABELS[s] : "Tümü"}
              </button>
            ))}
          </div>
          <select
            className="status-select"
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
          >
            <option value="">Tüm Tier</option>
            <option value="hot">🔥 Hot</option>
            <option value="warm">🌡️ Warm</option>
            <option value="cold">❄️ Cold</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="admin-loader">Yükleniyor...</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ad Soyad</th><th>Tedavi</th><th>Ülke</th><th>Kaynak</th>
                <th>Tier</th><th>Puan</th><th>Tarih</th><th>Durum</th>
                <th>Ata</th><th>Notlar</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <>
                  <tr key={l.id}>
                    <td>
                      <div className="td-bold">{l.name}</div>
                      <div className="td-muted" style={{ fontSize: 11 }}>{l.phone}</div>
                    </td>
                    <td>{l.treatmentType || "—"}</td>
                    <td>{l.country || "—"}</td>
                    <td><span className="source-badge">{l.source}</span></td>
                    <td>
                      {l.leadTier && (
                        <span className="tier-badge" style={{ background: TIER_COLORS[l.leadTier] + "22", color: TIER_COLORS[l.leadTier], border: `1px solid ${TIER_COLORS[l.leadTier]}55` }}>
                          {l.leadTier === "hot" ? "🔥" : l.leadTier === "warm" ? "🌡️" : "❄️"} {l.leadTier}
                        </span>
                      )}
                    </td>
                    <td>
                      {l.leadScore != null && (
                        <span className="score-badge">{l.leadScore}</span>
                      )}
                    </td>
                    <td className="td-muted">{new Date(l.createdAt).toLocaleDateString("tr-TR")}</td>
                    <td>
                      <select
                        className="status-select"
                        value={l.status}
                        onChange={(e) => changeStatus(l.id, e.target.value)}
                        style={{ color: STATUS_COLORS[l.status] }}
                      >
                        {Object.entries(STATUS_LABELS).map(([v, label]) => (
                          <option key={v} value={v}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      {l.status === "approved" || l.status === "assigned" ? (
                        <select
                          className="status-select"
                          value={l.assignedClinicId || ""}
                          onChange={(e) => assignLead(l.id, e.target.value)}
                        >
                          <option value="">Klinik Seç</option>
                          {clinics.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      ) : (
                        <span className="td-muted" style={{ fontSize: 12 }}>—</span>
                      )}
                    </td>
                    <td>
                      <button className="notes-btn" onClick={() => openNotes(l)}>
                        💬 {expandedLead?.id === l.id ? "Kapat" : "Notlar"}
                      </button>
                    </td>
                  </tr>
                  {expandedLead?.id === l.id && (
                    <tr key={`notes-${l.id}`}>
                      <td colSpan={10} className="notes-cell">
                        <div className="notes-panel">
                          <div className="notes-list">
                            {(notes[l.id] || []).length === 0 ? (
                              <p className="td-muted" style={{ fontSize: 13 }}>Not yok.</p>
                            ) : (
                              (notes[l.id] || []).map((n, i) => (
                                <div key={i} className="note-item">
                                  <span className="note-author">{n.authorName || "Admin"}</span>
                                  <span className="note-text">{n.content}</span>
                                  <span className="note-date">{n.createdAt ? new Date(n.createdAt).toLocaleDateString("tr-TR") : ""}</span>
                                </div>
                              ))
                            )}
                          </div>
                          <div className="note-input-row">
                            <input
                              className="note-input"
                              placeholder="Not ekle..."
                              value={noteInput}
                              onChange={(e) => setNoteInput(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && addNote(l.id)}
                            />
                            <button className="note-add-btn" onClick={() => addNote(l.id)}>Ekle</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!loading && leads.length === 0 && <p className="admin-empty">Lead bulunamadı.</p>}
    </>
  );
}

/* ─────────────────────── CAMPAIGNS ─────────────────────── */
function CampaignsTab() {
  const [campaigns, setCampaigns] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ clinicId: "", title: "", description: "", badgeText: "", discountType: "percent", discountValue: 0, startDate: "", endDate: "" });

  useEffect(() => {
    api.getAdminCampaigns().then(setCampaigns).catch(() => {});
    api.getAdminClinics().then(setClinics).catch(() => {});
  }, []);

  const createCampaign = async () => {
    if (!form.title || !form.clinicId) return;
    await api.createAdminCampaign({ ...form, clinicId: +form.clinicId, discountValue: +form.discountValue }).catch(() => {});
    const data = await api.getAdminCampaigns().catch(() => []);
    setCampaigns(data || []);
    setShowForm(false);
    setForm({ clinicId: "", title: "", description: "", badgeText: "", discountType: "percent", discountValue: 0, startDate: "", endDate: "" });
  };

  return (
    <>
      <div className="admin-title-row">
        <h1 className="admin-title">Kampanyalar</h1>
        <button className="admin-add-btn" onClick={() => setShowForm((v) => !v)}>
          {showForm ? "İptal" : "+ Yeni Kampanya"}
        </button>
      </div>

      {showForm && (
        <div className="admin-section">
          <h2>Yeni Kampanya</h2>
          <div className="form-grid">
            <div className="fg-group">
              <label>Klinik</label>
              <select value={form.clinicId} onChange={(e) => setForm({ ...form, clinicId: e.target.value })}>
                <option value="">Seçin</option>
                {clinics.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="fg-group">
              <label>Başlık</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Kampanya başlığı" />
            </div>
            <div className="fg-group">
              <label>Badge Metni</label>
              <input value={form.badgeText} onChange={(e) => setForm({ ...form, badgeText: e.target.value })} placeholder="örn. %20 İndirim" />
            </div>
            <div className="fg-group">
              <label>İndirim Tipi</label>
              <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
                <option value="percent">Yüzde (%)</option>
                <option value="fixed">Sabit ($)</option>
              </select>
            </div>
            <div className="fg-group">
              <label>İndirim Değeri</label>
              <input type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} />
            </div>
            <div className="fg-group">
              <label>Başlangıç Tarihi</label>
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div className="fg-group">
              <label>Bitiş Tarihi</label>
              <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
            </div>
            <div className="fg-group fg-full">
              <label>Açıklama</label>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Kampanya açıklaması" />
            </div>
          </div>
          <button className="fe-save" style={{ marginTop: 12 }} onClick={createCampaign}>Kaydet</button>
        </div>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Klinik</th><th>Başlık</th><th>Badge</th><th>İndirim</th><th>Tarih Aralığı</th><th>Durum</th></tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.id}>
                <td className="td-bold">{c.clinicName || `Klinik #${c.clinicId}`}</td>
                <td>{c.title}</td>
                <td><span className="pill pill-orange">{c.badgeText}</span></td>
                <td>{c.discountValue}{c.discountType === "percent" ? "%" : "$"}</td>
                <td className="td-muted">{c.startDate ? new Date(c.startDate).toLocaleDateString("tr-TR") : "—"} → {c.endDate ? new Date(c.endDate).toLocaleDateString("tr-TR") : "—"}</td>
                <td><span className={c.isActive ? "pill pill-green" : "pill pill-gray"}>{c.isActive ? "Aktif" : "Pasif"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {campaigns.length === 0 && <p className="admin-empty">Kampanya bulunamadı.</p>}
    </>
  );
}

/* ─────────────────────── BILLING ─────────────────────── */
function BillingTab() {
  const [billing, setBilling] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminBilling().then(setBilling).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const total = billing.reduce((sum, b) => sum + (b.amount || 0), 0);
  const paid  = billing.filter((b) => b.status === "paid").reduce((sum, b) => sum + (b.amount || 0), 0);

  return (
    <>
      <h1 className="admin-title">Faturalar & Ödemeler</h1>
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <StatCard icon="💰" label="Toplam Tutar" value={`$${total.toFixed(0)}`} />
        <StatCard icon="✅" label="Tahsil Edilen" value={`$${paid.toFixed(0)}`} sub={`${billing.filter((b) => b.status === "paid").length} kayıt`} />
        <StatCard icon="⏳" label="Bekleyen" value={`$${(total - paid).toFixed(0)}`} sub={`${billing.filter((b) => b.status !== "paid").length} kayıt`} />
      </div>

      {loading ? <div className="admin-loader">Yükleniyor...</div> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Klinik</th><th>Tür</th><th>Tutar</th><th>Açıklama</th><th>Tarih</th><th>Durum</th></tr>
            </thead>
            <tbody>
              {billing.map((b) => (
                <tr key={b.id}>
                  <td className="td-bold">{b.clinicName || `Klinik #${b.clinicId}`}</td>
                  <td><span className="source-badge">{b.type}</span></td>
                  <td style={{ color: "#4ade80", fontWeight: 700 }}>${b.amount?.toFixed(2)}</td>
                  <td className="td-muted">{b.description}</td>
                  <td className="td-muted">{new Date(b.createdAt).toLocaleDateString("tr-TR")}</td>
                  <td>
                    <span className={b.status === "paid" ? "pill pill-green" : b.status === "pending" ? "pill pill-gold" : "pill pill-gray"}>
                      {b.status === "paid" ? "Ödendi" : b.status === "pending" ? "Bekliyor" : b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!loading && billing.length === 0 && <p className="admin-empty">Fatura bulunamadı.</p>}
    </>
  );
}

/* ─────────────────────── PERFORMANCE ─────────────────────── */
function PerformanceTab() {
  const [perf, setPerf] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminPerformance().then(setPerf).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <h1 className="admin-title">Klinik Performans Skorları</h1>
      {loading ? <div className="admin-loader">Yükleniyor...</div> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th><th>Klinik</th><th>Skor</th><th>Yanıt Süresi</th>
                <th>Dönüşüm</th><th>Hastalar</th><th>Değerlendirme</th>
              </tr>
            </thead>
            <tbody>
              {perf.map((p, i) => (
                <tr key={p.clinicId}>
                  <td className="td-muted">{i + 1}</td>
                  <td className="td-bold">{p.clinicName}</td>
                  <td>
                    <div className="perf-score-wrap">
                      <div className="perf-score-bar" style={{ width: `${p.overallScore || 0}%`, background: p.overallScore >= 80 ? "#22c55e" : p.overallScore >= 60 ? "#f59e0b" : "#ef4444" }} />
                      <span className="perf-score-val">{p.overallScore?.toFixed(0)}</span>
                    </div>
                  </td>
                  <td>{p.avgResponseTime != null ? `${p.avgResponseTime}s` : "—"}</td>
                  <td>{p.conversionRate != null ? `${(p.conversionRate * 100).toFixed(1)}%` : "—"}</td>
                  <td>{p.totalPatients ?? "—"}</td>
                  <td>{p.avgRating != null ? `⭐ ${p.avgRating?.toFixed(1)}` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!loading && perf.length === 0 && <p className="admin-empty">Performans verisi bulunamadı.</p>}
    </>
  );
}

/* ─────────────────────── FIELDS ─────────────────────── */
function FieldsTab() {
  const [dynamicFields, setDynamicFields] = useState([]);
  const [filters, setFilters] = useState([]);
  const [editingField, setEditingField] = useState(null);
  const [editingFilter, setEditingFilter] = useState(null);

  useEffect(() => {
    Promise.all([api.getDynamicFields(), api.getFilters()]).then(([df, f]) => {
      setDynamicFields(df || []); setFilters(f || []);
    }).catch(() => {});
  }, []);

  const saveField = async (field) => {
    await api.updateDynamicField(field.id, field).catch(() => {});
    setDynamicFields((fs) => fs.map((f) => f.id === field.id ? field : f));
    setEditingField(null);
  };

  const saveFilter = async (filter) => {
    await api.updateFilter(filter.id, filter).catch(() => {});
    setFilters((fs) => fs.map((f) => f.id === filter.id ? filter : f));
    setEditingFilter(null);
  };

  return (
    <>
      <h1 className="admin-title">Alan & Filtre Yönetimi</h1>

      <div className="admin-section">
        <h2>Dinamik Alanlar</h2>
        <div className="fields-list">
          {dynamicFields.map((f) => (
            <div key={f.id} className="field-row">
              {editingField?.id === f.id ? (
                <FieldEditor item={editingField} onChange={setEditingField} onSave={() => saveField(editingField)} onCancel={() => setEditingField(null)} />
              ) : (
                <>
                  <div>
                    <span className="field-name">{f.name}</span>
                    <span className="field-type">{f.type}</span>
                    {f.categoryId && <span className="field-cat">Kategori: {f.categoryId}</span>}
                  </div>
                  <div className="field-actions">
                    <span className={f.isVisible ? "pill pill-green" : "pill pill-gray"}>{f.isVisible ? "Görünür" : "Gizli"}</span>
                    <button className="edit-btn" onClick={() => setEditingField({ ...f })}>Düzenle</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="admin-section">
        <h2>Filtreler</h2>
        <div className="fields-list">
          {filters.map((f) => (
            <div key={f.id} className="field-row">
              {editingFilter?.id === f.id ? (
                <FieldEditor item={editingFilter} onChange={setEditingFilter} onSave={() => saveFilter(editingFilter)} onCancel={() => setEditingFilter(null)} />
              ) : (
                <>
                  <div>
                    <span className="field-name">{f.name}</span>
                    <span className="field-type">{f.type}</span>
                  </div>
                  <div className="field-actions">
                    <span className={f.isVisible ? "pill pill-green" : "pill pill-gray"}>{f.isVisible ? "Görünür" : "Gizli"}</span>
                    <button className="edit-btn" onClick={() => setEditingFilter({ ...f })}>Düzenle</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─────────────────────── SHARED ─────────────────────── */
function FieldEditor({ item, onChange, onSave, onCancel }) {
  return (
    <div className="field-editor">
      <div className="fe-row">
        <div className="fe-group">
          <label>Ad</label>
          <input value={item.name} onChange={(e) => onChange({ ...item, name: e.target.value })} />
        </div>
        <div className="fe-group">
          <label>Sıra</label>
          <input type="number" value={item.order} onChange={(e) => onChange({ ...item, order: +e.target.value })} />
        </div>
        <div className="fe-group fe-check">
          <label>
            <input type="checkbox" checked={item.isVisible} onChange={(e) => onChange({ ...item, isVisible: e.target.checked })} />
            Görünür
          </label>
        </div>
      </div>
      {item.options && (
        <div className="fe-group">
          <label>Seçenekler (virgülle ayırın)</label>
          <input
            value={item.options.join(", ")}
            onChange={(e) => onChange({ ...item, options: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
          />
        </div>
      )}
      <div className="fe-actions">
        <button className="fe-save" onClick={onSave}>Kaydet</button>
        <button className="fe-cancel" onClick={onCancel}>İptal</button>
      </div>
    </div>
  );
}
