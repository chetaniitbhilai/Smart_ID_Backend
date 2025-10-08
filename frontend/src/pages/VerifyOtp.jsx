import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import './Login.css'
import { verifyOtp } from '../lib/api.js'

function VerifyOtp() {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [params] = useSearchParams()
  const email = params.get('email') || ''
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      console.log('Verifying OTP for email:', email, 'OTP:', otp)
      const res = await verifyOtp({ email, otp })
      console.log('OTP verification response:', res)
      // Backend automatically logs in user after OTP verification (sets cookie)
      // Fetch user profile to get user info and role
      try {
        const profileRes = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/auth/profile`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        })
        if (profileRes.ok) {
          const userData = await profileRes.json()
          if (userData?._id) {
            localStorage.setItem('userId', String(userData._id))
          }
          if (userData?.role) {
            localStorage.setItem('userRole', String(userData.role))
          }
        }
      } catch (profileError) {
        console.log('Could not fetch user profile:', profileError)
      }
      // Redirect to upcoming classes page since user is now logged in
      navigate('/upcomingclasses')
    } catch (e) {
      console.error('OTP verification error:', e)
      setError(e.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-top">
        <div className="login-logo-container">
          <img src={'/iitlogo.png'} alt="IIT Bhilai Logo" className="login-logo" />
          <h1 className="login-title">Verify OTP</h1>
        </div>
      </div>
      <div className="login-form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Enter OTP sent to {email}</label>
            <input type="text" inputMode="numeric" pattern="\\d*" value={otp} onChange={(e) => setOtp(e.target.value)} required />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button className="login-button" type="submit" disabled={loading}>{loading ? 'Verifying...' : 'Verify'}</button>
        </form>
      </div>
    </div>
  )
}

export default VerifyOtp


