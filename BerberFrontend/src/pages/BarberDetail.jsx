import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export default function BarberDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [barber, setBarber] = useState(null)
  const [selectedService, setSelectedService] = useState(null)
  const [form, setForm] = useState({ customerName: '', customerPhone: '', address: '', date: '' })
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/barbers/${id}`).then(r => r.json()).then(setBarber)
  }, [id])

  if (!barber) return <div className="empty">Yükleniyor...</div>

  const handleBook = async (e) => {
    e.preventDefault()
    if (!selectedService) return alert('Lütfen bir hizmet seçin.')
    setLoading(true)
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        barberId: barber.id,
        serviceId: selectedService.id,
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        address: form.address,
        date: new Date(form.date).toISOString(),
      }),
    })
    setLoading(false)
    if (res.ok) setSuccess(true)
  }

  if (success) return (
    <div>
      <div className="alert">✅ Randevunuz alındı! <strong>{barber.name}</strong> belirtilen adrese gelecek.</div>
      <button className="btn" style={{ width: 'auto' }} onClick={() => navigate('/bookings')}>Randevularımı Gör</button>
    </div>
  )

  return (
    <div>
      <span className="back-link" onClick={() => navigate('/')}>← Geri</span>
      <div className="detail-header">
        <div className="detail-avatar">{barber.name[0]}</div>
        <div>
          <h2>{barber.name}</h2>
          <div className="district">📍 {barber.district} &nbsp; ★ {barber.rating}</div>
          <p style={{ marginTop: '0.5rem', color: '#555' }}>{barber.bio}</p>
        </div>
      </div>

      <h2>Hizmetler</h2>
      <ul className="services-list">
        {barber.services.map(s => (
          <li key={s.id}
            className={`select-service${selectedService?.id === s.id ? ' selected' : ''}`}
            onClick={() => setSelectedService(s)}
            style={{ padding: '0.75rem 1rem', listStyle: 'none' }}
          >
            <span>{s.name} <span className="duration">({s.durationMin} dk)</span></span>
            <span className="price">{s.price}₺</span>
          </li>
        ))}
      </ul>

      <div className="booking-form">
        <h2>Randevu Al</h2>
        {selectedService && (
          <div style={{ marginBottom: '1rem', color: '#555' }}>
            Seçilen: <strong>{selectedService.name}</strong> — <span className="price">{selectedService.price}₺</span>
          </div>
        )}
        <form onSubmit={handleBook}>
          <div className="form-group">
            <label>Ad Soyad</label>
            <input required placeholder="Adınız Soyadınız" value={form.customerName}
              onChange={e => setForm({ ...form, customerName: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Telefon</label>
            <input required placeholder="05xx xxx xx xx" value={form.customerPhone}
              onChange={e => setForm({ ...form, customerPhone: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Adres</label>
            <input required placeholder="Ev adresiniz" value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Tarih ve Saat</label>
            <input required type="datetime-local" value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })} />
          </div>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Gönderiliyor...' : 'Randevu Al'}
          </button>
        </form>
      </div>
    </div>
  )
}
