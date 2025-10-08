import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'
import { IoChevronBackOutline, IoChevronDownOutline } from 'react-icons/io5'
import useLogin from '../hooks/uselogin.js'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const navigate = useNavigate()

  const { login, loading, error } = useLogin()

  const handleBack = () => {
    navigate('/')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const result = await login(username, password)
    if (result) {
      navigate('/upcomingclasses')
    }
  }

  const selectRole = (selectedRole) => {
    setRole(selectedRole)
    setIsDropdownOpen(false)
  }

  return (
    <div className="login-page">
      <div className="login-top">
        <button className="back-button" onClick={handleBack}>
          <IoChevronBackOutline />
        </button>
        <div className="login-logo-container">
          <img src={'/iitlogo.png'} alt="IIT Bhilai Logo" className="login-logo" />
          <h1 className="login-title">Login</h1>
        </div>
      </div>

      <div className="login-form-container">
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Select Role</label>
            <div className="dropdown">
              <div
                className="dropdown-header"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>{role || 'Select role'}</span>
                <IoChevronDownOutline className="dropdown-icon" />
              </div>
              {isDropdownOpen && (
                <div className="dropdown-options">
                  <div className="dropdown-option" onClick={() => selectRole('Student')}>Student</div>
                  <div className="dropdown-option" onClick={() => selectRole('Professor')}>Professor</div>
                  <div className="dropdown-option" onClick={() => selectRole('TA')}>TA</div>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>LDAP Username</label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login


