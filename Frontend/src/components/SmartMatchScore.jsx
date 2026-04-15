import "./SmartMatchScore.css";

export default function SmartMatchScore({ score = 0, compact = false }) {
  if (!score) return null;
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#94a3b8";
  if (compact) {
    return (
      <span className="sms-badge" style={{ background: color }}>
        %{score} uygun
      </span>
    );
  }
  return (
    <div className="sms-bar-wrap">
      <div className="sms-label">
        <span>Bu klinik sizin için</span>
        <strong style={{ color }}>%{score} uygun</strong>
      </div>
      <div className="sms-track">
        <div className="sms-fill" style={{ width: `${score}%`, background: color }} />
      </div>
    </div>
  );
}
