import "./TrustBadges.css";

export default function TrustBadges({ clinic }) {
  if (!clinic) return null;
  return (
    <div className="trust-badges">
      {clinic.patientsLast30Days > 0 && (
        <div className="trust-item">
          <span className="trust-icon">👥</span>
          <span>Son 30 günde <b>{clinic.patientsLast30Days}</b> hasta</span>
        </div>
      )}
      {clinic.patientCountries?.length > 0 && (
        <div className="trust-item">
          <span className="trust-icon">🌍</span>
          <span><b>{clinic.patientCountries.length}</b> ülkeden hastalar tercih etti</span>
        </div>
      )}
      {clinic.isVerified && (
        <div className="trust-item">
          <span className="trust-icon">✅</span>
          <span>Platform tarafından <b>doğrulandı</b></span>
        </div>
      )}
      {clinic.avgResponseTime && (
        <div className="trust-item">
          <span className="trust-icon">⚡</span>
          <span>Ort. dönüş süresi: <b>{clinic.avgResponseTime}</b></span>
        </div>
      )}
      {clinic.totalPatients > 0 && (
        <div className="trust-item">
          <span className="trust-icon">🏆</span>
          <span>Toplam <b>{clinic.totalPatients.toLocaleString()}</b> hasta</span>
        </div>
      )}
    </div>
  );
}
