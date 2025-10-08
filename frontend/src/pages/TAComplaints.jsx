import { useEffect, useState } from 'react'
import { listComplaintsForTA, resolveComplain } from '../lib/api.js'

function TAComplaints() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const taName = localStorage.getItem('userName')
        const userRole = localStorage.getItem('userRole')
        console.log('TAComplaints - taName:', taName, 'userRole:', userRole)
        if (!taName) {
          setError('Please login as TA - userName not found in localStorage')
          return
        }
        if (userRole !== 'ta') {
          setError('Please login as TA - current role is: ' + userRole)
          return
        }
        console.log('TAComplaints - fetching complaints for TA:', taName)
        const res = await listComplaintsForTA(taName)
        console.log('TAComplaints - API response:', res)
        const list = Array.isArray(res?.complaints) ? res.complaints : []
        if (mounted) setComplaints(list)
      } catch (e) {
        setError(e.message || 'Failed to load complaints')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const handleResolve = async (complainId) => {
    try {
      await resolveComplain({ complainId, response: 'Resolved by TA', status: true })
      setComplaints((prev) => prev.map((c) => c._id === complainId ? { ...c, status: true, response: 'Resolved by TA' } : c))
    } catch (e) {
      alert(e.message || 'Failed to resolve')
    }
  }

  if (loading) return <div className="auth-container"><p>Loading...</p></div>
  if (error) return <div className="auth-container"><p className="error-message">{error}</p></div>

  return (
    <div className="auth-container">
      <h2>TA Complaints</h2>
      {complaints.length === 0 ? (
        <p>No complaints assigned.</p>
      ) : (
        <div className="courses-list">
          {complaints.map((c) => (
            <div key={c._id} className="course-item">
              <h3>{c.coursecode || 'Course'}</h3>
              <p><strong>Student:</strong> {c.studentId?.name} ({c.studentId?.email})</p>
              <p><strong>Complain:</strong> {c.complain}</p>
              <p><strong>Status:</strong> {c.status ? 'Resolved' : 'Pending'}</p>
              {c.response && <p><strong>Response:</strong> {c.response}</p>}
              {!c.status && (
                <button onClick={() => handleResolve(c._id)}>Mark Resolved</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TAComplaints

