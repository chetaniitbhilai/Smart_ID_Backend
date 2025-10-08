import { useState } from 'react'
import { addComplain } from '../lib/api.js'

function StudentComplain() {
  const [coursecode, setCoursecode] = useState('')
  const [complain, setComplain] = useState('')
  const [taName, setTaName] = useState('')
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
      await addComplain({ coursecode, studentId, taName: taName || '', complain, status: false })
      setSuccess('Complain submitted successfully')
      setCoursecode('')
      setComplain('')
      setTaName('')
    } catch (e) {
      setError(e.message || 'Failed to submit complain')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <h2>Submit Complain</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Course Code
          <input type="text" value={coursecode} onChange={(e) => setCoursecode(e.target.value)} required />
        </label>
        <label>
          TA Name (optional)
          <input type="text" value={taName} onChange={(e) => setTaName(e.target.value)} />
        </label>
        <label>
          Complain
          <input type="text" value={complain} onChange={(e) => setComplain(e.target.value)} required />
        </label>
        {error && <p className="error-message">{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Submit'}</button>
      </form>
    </div>
  )
}

export default StudentComplain


