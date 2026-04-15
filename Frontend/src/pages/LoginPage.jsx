import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";
import { useApp } from "../context/AppContext";
import "./LoginPage.css";

export function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const data = await api.login(form);
      login(data);
      navigate(data.role === "admin" ? "/admin" : data.role === "clinic" ? "/clinic-panel/1" : "/panel");
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">Medtravio</div>
        <h2>Giriş Yap</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={submit}>
          <div className="auth-field">
            <label>E-posta</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="ornek@email.com" />
          </div>
          <div className="auth-field">
            <label>Şifre</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required placeholder="••••••••" />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>{loading ? "Giriş yapılıyor..." : "Giriş Yap"}</button>
        </form>
        <div className="auth-demo">
          <p>Demo hesaplar:</p>
          <button onClick={() => setForm({ email: "demo@medtravio.com", password: "demo123" })}>👤 Kullanıcı</button>
          <button onClick={() => setForm({ email: "admin@medtravio.com", password: "admin123" })}>🛡️ Admin</button>
        </div>
        <p className="auth-switch">Hesabınız yok mu? <Link to="/register">Kayıt Ol</Link></p>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await api.register(form);
      const data = await api.login({ email: form.email, password: form.password });
      login(data);
      navigate("/panel");
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">Medtravio</div>
        <h2>Kayıt Ol</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={submit}>
          {[
            { key: "name",     label: "Ad Soyad",   type: "text",     placeholder: "Adınız Soyadınız" },
            { key: "email",    label: "E-posta",     type: "email",    placeholder: "ornek@email.com"  },
            { key: "phone",    label: "Telefon",     type: "tel",      placeholder: "+90 5XX XXX XX XX" },
            { key: "password", label: "Şifre",       type: "password", placeholder: "En az 6 karakter" },
          ].map((f) => (
            <div key={f.key} className="auth-field">
              <label>{f.label}</label>
              <input type={f.type} value={form[f.key]} placeholder={f.placeholder} required
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
            </div>
          ))}
          <button type="submit" className="auth-btn" disabled={loading}>{loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}</button>
        </form>
        <p className="auth-switch">Zaten hesabınız var mı? <Link to="/login">Giriş Yap</Link></p>
      </div>
    </div>
  );
}
