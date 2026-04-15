import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import "./ClinicPanelPage.css";

const STATUS_LABEL = { pending: "Bekliyor", review: "İnceleniyor", approved: "Onaylandı", assigned: "Atandı", closed: "Kapandı" };
const STATUS_COLOR = { pending: "#f59e0b", review: "#3b82f6", approved: "#22c55e", assigned: "#8b5cf6", closed: "#64748b" };
const TIER_COLOR   = { premium: "#f59e0b", standard: "#3b82f6", low: "#ef4444" };

export default function ClinicPanelPage() {
  const { clinicId } = useParams();
  const id = Number(clinicId) || 1;
  const navigate = useNavigate();
  const [tab, setTab] = useState("dashboard");
  const [data, setData] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getClinicDashboard(id).then(setData).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (tab === "leads") {
      api.getClinicLeads(id).then(setLeads).catch(() => {});
    }
  }, [tab, id]);

  if (loading) return <div className="cp-loading">Yükleniyor...</div>;
  if (!data) return <div className="cp-loading">Klinik bulunamadı.</div>;

  const { clinic, stats, perf, leadsByStatus, recentLeads, campaigns, reviewCount, avgRating } = data;

  return (
    <div className="cp-page">
      <div className="cp-sidebar">
        <div className="cp-clinic-info">
          <img src={clinic.imageUrl} alt={clinic.name} className="cp-clinic-img" />
          <div className="cp-clinic-name">{clinic.name}</div>
          <div className="cp-clinic-city">{clinic.city}</div>
          {clinic.badge && <span className="cp-badge">{clinic.badge}</span>}
        </div>
        <nav className="cp-nav">
          {[
            { key: "dashboard", icon: "📊", label: "Dashboard" },
            { key: "leads",     icon: "📋", label: "Talepler" },
            { key: "profile",   icon: "⚙️", label: "Profil" },
            { key: "campaigns", icon: "🎯", label: "Kampanyalar" },
          ].map((item) => (
            <button key={item.key} className={`cp-nav-item ${tab === item.key ? "active" : ""}`} onClick={() => setTab(item.key)}>
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="cp-content">
        {tab === "dashboard" && (
          <>
            <h2 className="cp-title">Dashboard</h2>
            <div className="cp-kpi-grid">
              <div className="cp-kpi"><div className="cp-kpi-val">{stats.views?.toLocaleString()}</div><div className="cp-kpi-label">Görüntülenme</div></div>
              <div className="cp-kpi"><div className="cp-kpi-val">{stats.clicks}</div><div className="cp-kpi-label">Tıklama</div></div>
              <div className="cp-kpi"><div className="cp-kpi-val">{stats.leads}</div><div className="cp-kpi-label">Toplam Lead</div></div>
              <div className="cp-kpi"><div className="cp-kpi-val">{avgRating}★</div><div className="cp-kpi-label">Ort. Puan</div></div>
              <div className="cp-kpi"><div className="cp-kpi-val">{reviewCount}</div><div className="cp-kpi-label">Yorum</div></div>
              <div className="cp-kpi">
                <div className="cp-kpi-val" style={{ color: TIER_COLOR[perf.tier] }}>{perf.overallScore}</div>
                <div className="cp-kpi-label">Performans Skoru</div>
              </div>
            </div>

            <div className="cp-two-col">
              <div className="cp-box">
                <h3>Lead Durumları</h3>
                <div className="cp-lead-statuses">
                  {Object.entries(leadsByStatus).map(([s, count]) => (
                    <div key={s} className="cp-lead-status-row">
                      <span style={{ color: STATUS_COLOR[s] }}>{STATUS_LABEL[s]}</span>
                      <div className="cp-status-bar-track">
                        <div className="cp-status-bar-fill" style={{ width: `${Math.min(100, count * 10)}%`, background: STATUS_COLOR[s] }} />
                      </div>
                      <span className="cp-status-count">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="cp-box">
                <h3>Son Talepler</h3>
                <div className="cp-recent-leads">
                  {recentLeads.map((l) => (
                    <div key={l.id} className="cp-recent-lead">
                      <div>
                        <div className="cp-rl-name">{l.name}</div>
                        <div className="cp-rl-treatment">{l.treatmentType} · {l.country}</div>
                      </div>
                      <span className="cp-rl-status" style={{ color: STATUS_COLOR[l.status] }}>{STATUS_LABEL[l.status]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {campaigns.length > 0 && (
              <div className="cp-box cp-campaigns">
                <h3>Aktif Kampanyalar</h3>
                {campaigns.map((c) => (
                  <div key={c.id} className="cp-campaign-row">
                    <span className="cp-campaign-badge">{c.badgeText}</span>
                    <span className="cp-campaign-title">{c.title}</span>
                    <span className="cp-campaign-until">→ {new Date(c.endDate).toLocaleDateString("tr-TR")}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "leads" && (
          <>
            <h2 className="cp-title">Talepler</h2>
            <div className="cp-leads-table">
              {leads.map((l) => (
                <div key={l.id} className="cp-lead-row">
                  <div className="cp-lead-info">
                    <div className="cp-lead-nm">{l.name}</div>
                    <div className="cp-lead-meta">{l.phone} · {l.country} · {l.treatmentType}</div>
                    <div className="cp-lead-msg">{l.message}</div>
                  </div>
                  <div className="cp-lead-right">
                    <span className="cp-lead-tier" data-tier={l.leadTier}>{l.leadTier === "hot" ? "🔥" : l.leadTier === "warm" ? "🟡" : "❄️"} {l.leadTier}</span>
                    <span className="cp-lead-st" style={{ color: STATUS_COLOR[l.status] }}>{STATUS_LABEL[l.status]}</span>
                    <span className="cp-lead-score">Skor: {l.leadScore}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "profile" && (
          <>
            <h2 className="cp-title">Klinik Profili</h2>
            <div className="cp-profile-grid">
              <div className="cp-profile-row"><label>Klinik Adı</label><span>{clinic.name}</span></div>
              <div className="cp-profile-row"><label>Şehir</label><span>{clinic.city}</span></div>
              <div className="cp-profile-row"><label>Telefon</label><span>{clinic.phone}</span></div>
              <div className="cp-profile-row"><label>WhatsApp</label><span>{clinic.whatsApp || "–"}</span></div>
              <div className="cp-profile-row"><label>E-posta</label><span>{clinic.email}</span></div>
              <div className="cp-profile-row"><label>Website</label><span>{clinic.website || "–"}</span></div>
              <div className="cp-profile-row"><label>Fiyat Aralığı</label><span>${clinic.minPrice} – ${clinic.maxPrice} {clinic.priceCurrency}</span></div>
              <div className="cp-profile-row"><label>Ortalama Dönüş</label><span>{clinic.avgResponseTime}</span></div>
            </div>
          </>
        )}

        {tab === "campaigns" && (
          <>
            <h2 className="cp-title">Kampanyalar</h2>
            {campaigns.length === 0 ? (
              <div className="cp-empty">Aktif kampanya yok.</div>
            ) : campaigns.map((c) => (
              <div key={c.id} className="cp-campaign-card">
                <div className="cp-campaign-title">{c.title}</div>
                <div className="cp-campaign-desc">{c.description}</div>
                <div className="cp-campaign-meta">
                  <span className="cp-campaign-badge">{c.badgeText}</span>
                  <span>{new Date(c.startDate).toLocaleDateString("tr-TR")} – {new Date(c.endDate).toLocaleDateString("tr-TR")}</span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
