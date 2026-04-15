import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://api.testprocess.com.tr/WeatherForecast";

const WEATHER_ICONS = {
  Freezing: "🥶",
  Bracing: "🧊",
  Chilly: "🌬️",
  Cool: "🍃",
  Mild: "🌤️",
  Warm: "☀️",
  Balmy: "🌴",
  Hot: "🔥",
  Sweltering: "🌋",
  Scorching: "☄️",
};

function getIcon(summary) {
  return WEATHER_ICONS[summary] || "🌡️";
}

function getTempColor(temp) {
  if (temp < 0) return "#60a5fa";
  if (temp < 10) return "#93c5fd";
  if (temp < 20) return "#34d399";
  if (temp < 30) return "#fbbf24";
  return "#f87171";
}

export default function App() {
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setForecasts(data);
      setLastUpdated(new Date());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="app">
      <header className="hero-header">
        <div className="hero-content">
          <h1>🌍 Hava Durumu</h1>
          <p className="subtitle">5 Günlük Tahmin</p>
          {lastUpdated && (
            <p className="last-updated">
              Son güncelleme: {lastUpdated.toLocaleTimeString("tr-TR")}
            </p>
          )}
        </div>
        <button className="refresh-btn" onClick={fetchData} disabled={loading}>
          {loading ? "⏳" : "🔄"} Yenile
        </button>
      </header>

      <main className="main">
        {loading && (
          <div className="loader-container">
            <div className="loader"></div>
            <p>Veriler yükleniyor...</p>
          </div>
        )}

        {error && (
          <div className="error-card">
            <span className="error-icon">⚠️</span>
            <div>
              <strong>Veri alınamadı</strong>
              <p>{error}</p>
            </div>
            <button onClick={fetchData}>Tekrar Dene</button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="cards-grid">
              {forecasts.map((item, index) => {
                const color = getTempColor(item.temperatureC);
                const date = new Date(item.date);
                return (
                  <div
                    key={index}
                    className="weather-card"
                    style={{ "--accent": color }}
                  >
                    <div className="card-header">
                      <span className="card-icon">{getIcon(item.summary)}</span>
                      <div>
                        <div className="card-day">
                          {date.toLocaleDateString("tr-TR", { weekday: "long" })}
                        </div>
                        <div className="card-date">
                          {date.toLocaleDateString("tr-TR", {
                            day: "numeric",
                            month: "long",
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="temp-display">
                      <span className="temp-c" style={{ color }}>
                        {item.temperatureC}°C
                      </span>
                      <span className="temp-f">{item.temperatureF}°F</span>
                    </div>

                    <div
                      className="summary-badge"
                      style={{ background: color + "22", color }}
                    >
                      {item.summary}
                    </div>

                    <div className="temp-bar">
                      <div
                        className="temp-bar-fill"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(0, ((item.temperatureC + 20) / 60) * 100)
                          )}%`,
                          background: color,
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {forecasts.length > 0 && (
              <div className="stats-row">
                <div className="stat-card">
                  <span className="stat-icon">🌡️</span>
                  <span className="stat-label">Ortalama</span>
                  <span className="stat-value">
                    {Math.round(
                      forecasts.reduce((a, b) => a + b.temperatureC, 0) /
                        forecasts.length
                    )}
                    °C
                  </span>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">⬇️</span>
                  <span className="stat-label">En Düşük</span>
                  <span className="stat-value" style={{ color: "#60a5fa" }}>
                    {Math.min(...forecasts.map((f) => f.temperatureC))}°C
                  </span>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">⬆️</span>
                  <span className="stat-label">En Yüksek</span>
                  <span className="stat-value" style={{ color: "#f87171" }}>
                    {Math.max(...forecasts.map((f) => f.temperatureC))}°C
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="footer">
        <p>TestProcess Weather Dashboard</p>
      </footer>
    </div>
  );
}
