import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCourses } from '../lib/api.js'

function Courses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const userId = localStorage.getItem('userId') || ''
        if (!userId) {
          setError('Please login first')
          return
        }
        const data = await getCourses(userId)
        if (mounted) setCourses(Array.isArray(data) ? data : data?.courses || [])
      } catch (e) {
        setError(e.message || 'Failed to load courses')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  if (loading) return <div className="auth-container"><p>Loading courses...</p></div>
  if (error) return <div className="auth-container"><p className="error-message">{error}</p></div>

  return (
    <div className="auth-container">
      <h2>My Courses</h2>
      {courses.length === 0 ? (
        <p>No courses enrolled.</p>
      ) : (
        <div className="courses-list">
          {courses.map((c, idx) => (
            <div key={c.id || c._id || idx} className="course-item">
              <h3>{c.courseName}</h3>
              <p><strong>Code:</strong> {c.courseCode}</p>
              {c.professorName && <p><strong>Professor:</strong> {c.professorName}</p>}
              {c.taNames && c.taNames.length > 0 && (
                <p><strong>TAs:</strong> {c.taNames.join(', ')}</p>
              )}
            </div>
          ))}
        </div>
      )}
      {localStorage.getItem('userRole') === 'professor' && (
        <div style={{ marginTop: 16 }}>
          <Link to="/courses/add" className="add-course-link">Add Course</Link>
        </div>
      )}
    </div>
  )
}

export default Courses


