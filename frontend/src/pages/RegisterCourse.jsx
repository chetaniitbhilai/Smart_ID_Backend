import { useState } from 'react'
import { registerCourse } from '../lib/api.js'

function RegisterCourse() {
  const [coursecode, setCoursecode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const studentId = localStorage.getItem('userId')
      if (!studentId) {
        setError('Please login first')
        return
      }
      await registerCourse({ coursecode, studentId })
      setSuccess('Registered successfully')
      setCoursecode('')
    } catch (e) {
      setError(e.message || 'Failed to register')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <h2>Register in Course</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Course Code
          <input type="text" value={coursecode} onChange={(e) => setCoursecode(e.target.value)} required />
        </label>
        {error && <p className="error-message">{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
      </form>
    </div>
  )
}

export default RegisterCourse


