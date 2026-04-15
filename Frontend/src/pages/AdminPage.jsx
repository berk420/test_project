import { useEffect, useState } from "react";
import { api } from "../api/client";
import "./AdminPage.css";

const STATUS_LABELS = { new: "Yeni", contacted: "İletişime Geçildi", converted: "Dönüştürüldü" };
const STATUS_COLORS = { new: "#3b82f6", contacted: "#f59e0b", converted: "#22c55e" };

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
  const [stats, setStats] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [leads, setLeads] = useState([]);
  const [dynamicFields, setDynamicFields] = useState([]);
  const [filters, setFilters] = useState([]);
  const [leadFilter, setLeadFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editingFilter, setEditingFilter] = useState(null);

  useEffect(() => {
    if (tab === "dashboard") {
      setLoading(true);
      Promise.all([api.getAdminStats(), api.getAdminClinics()])
        .then(([s, c]) => { setStats(s); setClinics(c); })
        .finally(() => setLoading(false));
    }
    if (tab === "leads") {
      api.getAdminLeads(leadFilter ? { status: leadFilter } : {}).then(setLeads);
    }
    if (tab === "fields") {
      Promise.all([api.getDynamicFields(), api.getFilters()]).then(([df, f]) => {
        setDynamicFields(df); setFilters(f);
      });
    }
  }, [tab, leadFilter]);

  const changeLeadStatus = async (id, status) => {
    await api.updateLeadStatus(id, status);
    setLeads(ls => ls.map(l => l.id === id ? { ...l, status } : l));
  };

  const saveField = async (field) => {
    await api.updateDynamicField(field.id, field);
    setDynamicFields(fs => fs.map(f => f.id === field.id ? field : f));
    setEditingField(null);
  };

  const saveFilter = async (filter) => {
    await api.updateFilter(filter.id, filter);
    setFilters(fs => fs.map(f => f.id === filter.id ? filter : f));
    setEditingFilter(null);
  };

  return (
    <div className="admin-page">
      <div className="admin-sidebar">
        <div className="admin-logo">⚙️ Admin Panel</div>
        {[
          { key: "dashboard", label: "📊 Dashboard" },
          { key: "leads", label: "📋 Lead Yönetimi" },
          { key: "fields", label: "🔧 Alan & Filtre Yönetimi" },
        ].map(t => (
          <button key={t.key} className={tab === t.key ? "sidebar-btn active" : "sidebar-btn"} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {/* DASHBOARD */}
        {tab === "dashboard" && (
          <>
            <h1 className="admin-title">Dashboard</h1>
            {loading ? <div className="admin-loader">Yükleniyor...</div> : stats && (
              <>
                <div className="stats-grid">
                  <StatCard icon="🏥" label="Toplam Klinik"   value={stats.totalClinics}   />
                  <StatCard icon="👁️" label="Toplam Görüntüleme" value={stats.totalViews.toLocaleString()} />
                  <StatCard icon="🖱️" label="Toplam Tıklanma"  value={stats.totalClicks.toLocaleString()} />
                  <StatCard icon="📩" label="Toplam Lead"      value={stats.totalLeads}    sub={`Bugün: ${stats.newLeadsToday} yeni`} />
                </div>

                {/* Lead by Status */}
                <div className="admin-section">
                  <h2>Lead Durumları</h2>
                  <div className="lead-status-bars">
                    {stats.leadsByStatus.map(s => {
                      const pct = stats.totalLeads ? Math.round(s.count / stats.totalLeads * 100) : 0;
                      return (
                        <div key={s.status} className="status-bar-row">
                          <span className="status-name" style={{ color: STATUS_COLORS[s.status] }}>
                            {STATUS_LABELS[s.status]}
                          </span>
                          <div className="status-bar-track">
                            <div className="status-bar-fill" style={{ width: `${pct}%`, background: STATUS_COLORS[s.status] }} />
                          </div>
                          <span className="status-count">{s.count} ({pct}%)</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Top Clinics */}
                <div className="admin-section">
                  <h2>Klinik İstatistikleri</h2>
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr><th>Klinik</th><th>Kategori</th><th>Şehir</th><th>Görüntüleme</th><th>Tıklanma</th><th>Lead</th><th>Durum</th></tr>
                      </thead>
                      <tbody>
                        {clinics.map(c => (
                          <tr key={c.id}>
                            <td className="td-bold">{c.name}</td>
                            <td>{c.categoryName}</td>
                            <td>{c.city}</td>
                            <td>{c.views.toLocaleString()}</td>
                            <td>{c.clicks.toLocaleString()}</td>
                            <td><span className="td-leads">{c.leads}</span></td>
                            <td>
                              {c.isVerified && <span className="pill pill-green">Onaylı</span>}
                              {c.isFeatured && <span className="pill pill-gold">Öne Çıkan</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* LEADS */}
        {tab === "leads" && (
          <>
            <div className="admin-title-row">
              <h1 className="admin-title">Lead Yönetimi</h1>
              <div className="lead-filter-tabs">
                {["", "new", "contacted", "converted"].map(s => (
                  <button key={s} className={leadFilter === s ? "lf-tab active" : "lf-tab"} onClick={() => setLeadFilter(s)}>
                    {s ? STATUS_LABELS[s] : "Tümü"}
                  </button>
                ))}
              </div>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>Ad Soyad</th><th>Telefon</th><th>Klinik</th><th>Kaynak</th><th>Tarih</th><th>Durum</th><th>İşlem</th></tr>
                </thead>
                <tbody>
                  {leads.map(l => (
                    <tr key={l.id}>
                      <td className="td-bold">{l.name}</td>
                      <td>{l.phone}</td>
                      <td>{l.clinicName}</td>
                      <td><span className="source-badge">{l.source}</span></td>
                      <td className="td-muted">{new Date(l.createdAt).toLocaleDateString("tr-TR")}</td>
                      <td>
                        <span className="status-dot" style={{ background: STATUS_COLORS[l.status] }} />
                        <span style={{ color: STATUS_COLORS[l.status] }}>{STATUS_LABELS[l.status]}</span>
                      </td>
                      <td>
                        <select
                          className="status-select"
                          value={l.status}
                          onChange={e => changeLeadStatus(l.id, e.target.value)}
                        >
                          <option value="new">Yeni</option>
                          <option value="contacted">İletişime Geçildi</option>
                          <option value="converted">Dönüştürüldü</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {leads.length === 0 && <p className="admin-empty">Lead bulunamadı.</p>}
          </>
        )}

        {/* FIELDS */}
        {tab === "fields" && (
          <>
            <h1 className="admin-title">Alan & Filtre Yönetimi</h1>

            <div className="admin-section">
              <h2>Dinamik Alanlar</h2>
              <div className="fields-list">
                {dynamicFields.map(f => (
                  <div key={f.id} className="field-row">
                    {editingField?.id === f.id ? (
                      <FieldEditor
                        item={editingField}
                        onChange={setEditingField}
                        onSave={() => saveField(editingField)}
                        onCancel={() => setEditingField(null)}
                      />
                    ) : (
                      <>
                        <div>
                          <span className="field-name">{f.name}</span>
                          <span className="field-type">{f.type}</span>
                          {f.categoryId && <span className="field-cat">Kategori: {f.categoryId}</span>}
                        </div>
                        <div className="field-actions">
                          <span className={f.isVisible ? "pill pill-green" : "pill pill-gray"}>
                            {f.isVisible ? "Görünür" : "Gizli"}
                          </span>
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
                {filters.map(f => (
                  <div key={f.id} className="field-row">
                    {editingFilter?.id === f.id ? (
                      <FieldEditor
                        item={editingFilter}
                        onChange={setEditingFilter}
                        onSave={() => saveFilter(editingFilter)}
                        onCancel={() => setEditingFilter(null)}
                      />
                    ) : (
                      <>
                        <div>
                          <span className="field-name">{f.name}</span>
                          <span className="field-type">{f.type}</span>
                        </div>
                        <div className="field-actions">
                          <span className={f.isVisible ? "pill pill-green" : "pill pill-gray"}>
                            {f.isVisible ? "Görünür" : "Gizli"}
                          </span>
                          <button className="edit-btn" onClick={() => setEditingFilter({ ...f })}>Düzenle</button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FieldEditor({ item, onChange, onSave, onCancel }) {
  return (
    <div className="field-editor">
      <div className="fe-row">
        <div className="fe-group">
          <label>Ad</label>
          <input value={item.name} onChange={e => onChange({ ...item, name: e.target.value })} />
        </div>
        <div className="fe-group">
          <label>Sıra</label>
          <input type="number" value={item.order} onChange={e => onChange({ ...item, order: +e.target.value })} />
        </div>
        <div className="fe-group fe-check">
          <label>
            <input type="checkbox" checked={item.isVisible} onChange={e => onChange({ ...item, isVisible: e.target.checked })} />
            Görünür
          </label>
        </div>
      </div>
      {item.options && (
        <div className="fe-group">
          <label>Seçenekler (virgülle ayırın)</label>
          <input
            value={item.options.join(", ")}
            onChange={e => onChange({ ...item, options: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
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
