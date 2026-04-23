import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Bookings() {
  const [bookings, setBookings] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/bookings').then(r => r.json()).then(setBookings)
  }, [])

  if (bookings.length === 0) return (
    <div>
      <h1>Randevularım</h1>
      <div className="empty">
        <p>Henüz randevunuz yok.</p>
        <button className="btn" style={{ width: 'auto', marginTop: '1rem' }} onClick={() => navigate('/')}>
          Berber Bul
        </button>
      </div>
    </div>
  )

  return (
    <div>
      <h1>Randevularım</h1>
      {bookings.map(b => (
        <div key={b.id} className="booking-card">
          <div>
            <div style={{ fontWeight: 600 }}>Randevu #{b.id}</div>
            <div style={{ color: '#555', fontSize: '0.9rem', marginTop: '0.3rem' }}>
              {b.customerName} · {b.customerPhone}
            </div>
            <div style={{ color: '#888', fontSize: '0.85rem' }}>
              📍 {b.address}
            </div>
            <div style={{ color: '#888', fontSize: '0.85rem' }}>
              🕐 {new Date(b.date).toLocaleString('tr-TR')}
            </div>
          </div>
          <span className="status">{b.status}</span>
        </div>
      ))}
    </div>
  )
}
