import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import BarberDetail from './pages/BarberDetail'
import Bookings from './pages/Bookings'

export default function App() {
  return (
    <div className="app">
      <header className="navbar">
        <Link to="/" className="logo">✂ Berber Sepeti</Link>
        <nav>
          <Link to="/">Berberler</Link>
          <Link to="/bookings">Randevularım</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/barber/:id" element={<BarberDetail />} />
          <Route path="/bookings" element={<Bookings />} />
        </Routes>
      </main>
    </div>
  )
}
