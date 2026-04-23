import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const [barbers, setBarbers] = useState([])
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/barbers').then(r => r.json()).then(setBarbers)
  }, [])

  const filtered = barbers.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.district.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h1>Evinize Berber Çağırın</h1>
      <input
        className="search-bar"
        placeholder="Berber adı veya ilçe ara..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="barber-grid">
        {filtered.map(b => (
          <div key={b.id} className="card" onClick={() => navigate(`/barber/${b.id}`)}>
            <div className="card-avatar">{b.name[0]}</div>
            <h3>{b.name}</h3>
            <div className="district">📍 {b.district}</div>
            <div className="rating">★ {b.rating}</div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#555' }}>{b.bio}</div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <div className="empty">Berber bulunamadı.</div>}
    </div>
  )
}
