import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { logout as apiLogout } from './lib/api.js'
import './App.css'

function App() {
  const location = useLocation()
  const navigate = useNavigate()

  const clearAllAuthData = () => {
    // Clear all localStorage items
    localStorage.removeItem('userId')
    localStorage.removeItem('userRole')
    localStorage.removeItem('taId')
    localStorage.removeItem('professorId')
    
    // Clear any other potential auth tokens
    localStorage.removeItem('token')
    localStorage.removeItem('authToken')
    localStorage.removeItem('jwt')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    
    // Clear sessionStorage as well
    sessionStorage.clear()
    
    // Clear all localStorage (nuclear option)
    localStorage.clear()
  }

  const handleLogout = async () => {
    try {
      await apiLogout()
    } catch (e) {
      // ignore network errors for logout
    }
    
    // Always clear local data regardless of API response
    clearAllAuthData()
    
    navigate('/login')
  }
  return (
    <div className="app-container">
      <header className="app-header">
        <nav className="nav">
          <div className="nav-left">
            <Link to="/" className="nav-brand">
              <img src="/iitlogo.png" alt="IIT Bhilai" className="nav-logo" />
              <span>Smart Attendance</span>
            </Link>
          </div>
          
          <div className="nav-right">
            {!localStorage.getItem('userId') && (
              <>
                <Link to="/login" className={location.pathname === '/login' || location.pathname === '/' ? 'active' : ''}>Login</Link>
                <Link to="/signup" className={location.pathname === '/signup' ? 'active' : ''}>Signup</Link>
              </>
            )}
            {localStorage.getItem('userId') && (
              <>
                <Link to="/courses" className={location.pathname.startsWith('/courses') ? 'active' : ''}>Courses</Link>
                {localStorage.getItem('userRole') === 'student' && (
                  <>
                    <Link to="/complain" className={location.pathname === '/complain' ? 'active' : ''}>Complain</Link>
                    <Link to="/attendance/check" className={location.pathname === '/attendance/check' ? 'active' : ''}>My Attendance</Link>
                  </>
                )}
                {(localStorage.getItem('userRole') === 'ta' || localStorage.getItem('userRole') === 'professor') && (
                  <Link to="/attendance/management" className={location.pathname === '/attendance/management' ? 'active' : ''}>Attendance Management</Link>
                )}
                {localStorage.getItem('userRole') === 'ta' && (
                  <Link to="/ta/complaints" className={location.pathname === '/ta/complaints' ? 'active' : ''}>TA Complaints</Link>
                )}
                <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>Profile</Link>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}

export default App
