import { useState } from "react";
import { api } from "../api/client";
import "./LeadForm.css";

export default function LeadForm({ clinic }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "", country: "", treatmentType: "" });
  const [state, setState] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setState("loading");
    setError("");
    try {
      await api.createLead({ ...form, clinicId: clinic.id, source: "detail" });
      setState("success");
    } catch (err) {
      setError(err.message);
      setState("error");
    }
  };

  if (state === "success") {
    return (
      <div className="lead-success">
        <span className="success-icon">✅</span>
        <h3>Talebiniz Alındı!</h3>
        <p>En kısa sürede <strong>{clinic.name}</strong> ekibi sizinle iletişime geçecek.</p>
      </div>
    );
  }

  return (
    <form className="lead-form" onSubmit={submit}>
      <h3 className="lead-title">Bilgi / Randevu Talebi</h3>
      <p className="lead-sub">Formu doldurun, klinik sizi arasın.</p>

      <div className="form-row">
        <div className="form-group">
          <label>Ad Soyad *</label>
          <input value={form.name} onChange={set("name")} placeholder="Ad Soyad" required />
        </div>
        <div className="form-group">
          <label>Telefon *</label>
          <input value={form.phone} onChange={set("phone")} placeholder="05XX XXX XX XX" required />
        </div>
      </div>

      <div className="form-group">
        <label>E-posta</label>
        <input type="email" value={form.email} onChange={set("email")} placeholder="ornek@email.com" />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Ülke</label>
          <input value={form.country} onChange={set("country")} placeholder="Ülkeniz" />
        </div>
        <div className="form-group">
          <label>Tedavi Türü</label>
          <input value={form.treatmentType} onChange={set("treatmentType")} placeholder="örn. Saç Ekimi" />
        </div>
      </div>

      <div className="form-group">
        <label>Mesajınız</label>
        <textarea value={form.message} onChange={set("message")} placeholder="Sormak istediklerinizi yazın..." rows={3} />
      </div>

      {state === "error" && <p className="form-error">⚠️ {error}</p>}

      <button type="submit" className="form-submit" disabled={state === "loading"}>
        {state === "loading" ? "Gönderiliyor..." : "Gönder →"}
      </button>

      <p className="form-note">Bilgileriniz yalnızca klinik ile paylaşılır.</p>
    </form>
  );
}
