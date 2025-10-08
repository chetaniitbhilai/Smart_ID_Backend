import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCourses } from '../lib/api.js'
import './Courses.css'

function Courses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const userRole = localStorage.getItem('userRole')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const userId = localStorage.getItem('userId') || ''
        const userRole = localStorage.getItem('userRole') || ''
        if (!userId) {
          setError('Please login first')
          return
        }
        const data = await getCourses(userId, userRole)
        if (mounted) setCourses(Array.isArray(data) ? data : data?.courses || [])
      } catch (e) {
        setError(e.message || 'Failed to load courses')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  if (loading) {
    return (
      <div className="courses-page">
        <div className="courses-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading courses...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="courses-page">
        <div className="courses-container">
          <div className="error-message">
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Professor-specific view with options
  if (userRole === 'professor') {
    return (
      <div className="courses-page">
        <div className="courses-container">
          <div className="professor-options-header">
            <h1>Course Management</h1>
            <p>Choose an option to manage your courses</p>
          </div>

          <div className="professor-options">
            <Link to="/courses/my-courses" className="option-card">
              <div className="option-icon">📚</div>
              <h3>My Courses</h3>
              <p>View and manage your teaching courses</p>
              <div className="option-arrow">→</div>
            </Link>

            <Link to="/courses/add" className="option-card">
              <div className="option-icon">➕</div>
              <h3>Add Course</h3>
              <p>Create a new course for your students</p>
              <div className="option-arrow">→</div>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Student/TA view
  return (
    <div className="courses-page">
      <div className="courses-container">
        <div className="courses-header">
          <h1>My Courses</h1>
          <p>Courses you are enrolled in</p>
        </div>

        {courses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No Courses Enrolled</h3>
            <p>You haven't enrolled in any courses yet.</p>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.map((course, idx) => (
              <div key={course.id || course._id || idx} className="course-card">
                <div className="course-header">
                  <h3 className="course-name">{course.courseName}</h3>
                  <span className="course-code">{course.courseCode}</span>
                </div>
                
                <div className="course-details">
                  {course.professorName && (
                    <div className="detail-item">
                      <span className="detail-label">Professor:</span>
                      <span className="detail-value">{course.professorName}</span>
                    </div>
                  )}
                  {course.taNames && course.taNames.length > 0 && (
                    <div className="detail-item">
                      <span className="detail-label">TAs:</span>
                      <span className="detail-value">{course.taNames.join(', ')}</span>
                    </div>
                  )}
                </div>

                <div className="course-actions">
                  <Link to={`/attendance/check?course=${course.courseCode}`} className="action-btn primary">
                    View Attendance
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Courses


