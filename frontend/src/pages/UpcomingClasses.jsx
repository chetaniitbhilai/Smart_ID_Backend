import { useEffect, useState } from 'react'
import { getUpcoming } from '../lib/api.js'

function UpcomingClasses() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const userId = localStorage.getItem('userId')
        const role = localStorage.getItem('userRole')
        if (!userId) {
          setError('Please login first')
          return
        }
        const res = await getUpcoming(role === 'professor' ? { professorId: userId } : { studentId: userId })
        const list = Array.isArray(res?.upcoming) ? res.upcoming : []
        if (mounted) setItems(list)
      } catch (e) {
        setError(e.message || 'Failed to load upcoming classes')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  if (loading) return <div className="auth-container"><p>Loading...</p></div>
  if (error) return <div className="auth-container"><p className="error-message">{error}</p></div>

  const dayKeys = ['sun','mon','tue','wed','thu','fri','sat']
  const todayKey = dayKeys[new Date().getDay()]
  const todayItems = items
    .map((it) => ({
      ...it,
      // Expect slots: [{ day: 'mon', start: '10:00', end: '11:00' }]
      slots: Array.isArray(it.slots)
        ? it.slots.filter((s) => typeof s === 'object' && s?.day === todayKey)
        : [],
    }))
    .filter((it) => it.slots.length > 0)

  return (
    <div className="auth-container">
      <h2>Upcoming Classes</h2>
      {todayItems.length === 0 ? (
        <p>No classes scheduled for today.</p>
      ) : (
        <div className="courses-list">
          {todayItems.map((it, idx) => (
            <div key={idx} className="course-item">
              {it.slots.length > 0 ? (
                <ul>
                  {it.slots.map((slot, i) => (
                    <li key={i}>{it.courseName} ({it.courseCode}) — {slot.start} - {slot.end}</li>
                  ))}
                </ul>
              ) : (
                <p>No scheduled slots today</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UpcomingClasses


