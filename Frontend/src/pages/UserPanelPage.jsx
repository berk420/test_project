import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useApp } from "../context/AppContext";
import "./UserPanelPage.css";

const STATUS_LABEL = { pending: "Bekliyor", review: "İnceleniyor", approved: "Onaylandı", assigned: "Atandı", closed: "Kapandı" };
const STATUS_COLOR = { pending: "#f59e0b", review: "#3b82f6", approved: "#22c55e", assigned: "#8b5cf6", closed: "#64748b" };

export default function UserPanelPage() {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState("leads");
  const [leads, setLeads] = useState([]);
  const [favs, setFavs] = useState([]);
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    api.getUserLeads(user.id).then(setLeads).catch(() => {});
    api.getFavorites(user.id).then(setFavs).catch(() => {});
    api.getNotifications(user.id).then((d) => setNotifs(Array.isArray(d) ? d : [])).catch(() => {});
  }, [user]);

  if (!user) return null;

  const removeFav = async (clinicId) => {
    await api.toggleFavorite(user.id, clinicId);
    setFavs((prev) => prev.filter((c) => c.id !== clinicId));
  };

  return (
    <div className="up-page">
      <div className="up-sidebar">
        <div className="up-avatar">
          <div className="up-avatar-circle">{user.name?.[0]?.toUpperCase()}</div>
          <div>
            <div className="up-name">{user.name}</div>
            <div className="up-email">{user.email}</div>
          </div>
        </div>
        <nav className="up-nav">
          {[
            { key: "leads", icon: "📋", label: "Taleplerim" },
            { key: "favorites", icon: "❤️", label: "Favoriler" },
            { key: "notifications", icon: "🔔", label: "Bildirimler" },
            { key: "profile", icon: "👤", label: "Profil" },
          ].map((item) => (
            <button
              key={item.key}
              className={`up-nav-item ${tab === item.key ? "active" : ""}`}
              onClick={() => setTab(item.key)}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
        <button className="up-logout" onClick={() => { logout(); navigate("/"); }}>Çıkış Yap</button>
      </div>

      <div className="up-content">
        {tab === "leads" && (
          <>
            <h2 className="up-section-title">Taleplerim</h2>
            {leads.length === 0 ? (
              <div className="up-empty">
                <p>Henüz bir talebiniz yok.</p>
                <button onClick={() => navigate("/clinics")}>Klinik Ara</button>
              </div>
            ) : (
              <div className="up-leads">
                {leads.map((l) => (
                  <div key={l.id} className="up-lead-card">
                    <div className="up-lead-head">
                      <div>
                        <div className="up-lead-treatment">{l.treatmentType || "Genel"}</div>
                        <div className="up-lead-clinic">{l.assignedClinicName || "Atanmadı"}</div>
                      </div>
                      <span className="up-lead-status" style={{ background: STATUS_COLOR[l.status] + "22", color: STATUS_COLOR[l.status] }}>
                        {STATUS_LABEL[l.status] || l.status}
                      </span>
                    </div>
                    <div className="up-lead-msg">{l.message}</div>
                    <div className="up-lead-date">{new Date(l.createdAt).toLocaleDateString("tr-TR")}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "favorites" && (
          <>
            <h2 className="up-section-title">Favori Kliniklerim</h2>
            {favs.length === 0 ? (
              <div className="up-empty">
                <p>Henüz favori klinik eklemediniz.</p>
                <button onClick={() => navigate("/clinics")}>Klinik Ara</button>
              </div>
            ) : (
              <div className="up-favs">
                {favs.map((c) => (
                  <div key={c.id} className="up-fav-card">
                    <img src={c.imageUrl} alt={c.name} onClick={() => navigate(`/clinic/${c.slug}`)} />
                    <div className="up-fav-info">
                      <div className="up-fav-name" onClick={() => navigate(`/clinic/${c.slug}`)}>{c.name}</div>
                      <div className="up-fav-city">{c.city} · ★ {c.rating}</div>
                    </div>
                    <button className="up-fav-remove" onClick={() => removeFav(c.id)}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "notifications" && (
          <>
            <h2 className="up-section-title">Bildirimler</h2>
            {notifs.length === 0 ? (
              <div className="up-empty"><p>Bildiriminiz yok.</p></div>
            ) : (
              <div className="up-notifs">
                {notifs.map((n) => (
                  <div key={n.id} className={`up-notif ${n.isRead ? "read" : "unread"}`}>
                    <div className="up-notif-title">{n.title}</div>
                    <div className="up-notif-msg">{n.message}</div>
                    <div className="up-notif-date">{new Date(n.createdAt).toLocaleDateString("tr-TR")}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "profile" && (
          <>
            <h2 className="up-section-title">Profilim</h2>
            <div className="up-profile-info">
              <div className="up-profile-row"><label>Ad Soyad</label><span>{user.name}</span></div>
              <div className="up-profile-row"><label>E-posta</label><span>{user.email}</span></div>
              <div className="up-profile-row"><label>Rol</label><span className="up-role-badge">{user.role}</span></div>
              <div className="up-profile-row"><label>Ülke</label><span>{user.country || "–"}</span></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
