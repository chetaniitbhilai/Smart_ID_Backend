import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { logout as apiLogout } from './lib/api.js'
import './App.css'

function App() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await apiLogout()
    } catch (e) {
      // ignore network errors for logout
    }
    localStorage.removeItem('userId')
    localStorage.removeItem('userRole')
    localStorage.removeItem('taId')
    localStorage.removeItem('professorId')
    navigate('/login')
  }
  return (
    <div className="app-container">
      <header className="app-header">
        <nav className="nav">
          {!localStorage.getItem('userId') && (
            <>
              <Link to="/login" className={location.pathname === '/login' || location.pathname === '/' ? 'active' : ''}>Login</Link>
              <Link to="/signup" className={location.pathname === '/signup' ? 'active' : ''}>Signup</Link>
            </>
          )}
          <Link to="/courses" className={location.pathname.startsWith('/courses') ? 'active' : ''}>Courses</Link>
          {localStorage.getItem('userRole') === 'student' && (
            <Link to="/complain" className={location.pathname === '/complain' ? 'active' : ''}>Complain</Link>
          )}
          {localStorage.getItem('userRole') === 'ta' && (
            <Link to="/ta/complaints" className={location.pathname === '/ta/complaints' ? 'active' : ''}>TA Complaints</Link>
          )}
          {localStorage.getItem('userId') && (
            <button onClick={handleLogout} style={{ marginLeft: 12 }}>Logout</button>
          )}
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}

export default App
