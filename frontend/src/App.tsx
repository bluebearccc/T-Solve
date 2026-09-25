import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import SolutionsPage from './pages/SolutionsPage'
import TicketsPage from './pages/TicketsPage'

export default function App() {
  return (
    <div className="layout">
      <header className="topbar">
        <strong>T-Solve</strong>
        <nav>
          <NavLink to="/solutions">Solutions</NavLink>
          <NavLink to="/tickets">Tickets</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/solutions" replace />} />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/tickets" element={<TicketsPage />} />
        </Routes>
      </main>
    </div>
  )
}
