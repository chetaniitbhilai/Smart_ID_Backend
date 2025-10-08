import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCourses } from '../lib/api.js'
import './ProfessorCourses.css'

function ProfessorCourses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
      <div className="professor-courses-page">
        <div className="professor-courses-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading your courses...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="professor-courses-page">
        <div className="professor-courses-container">
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

  return (
    <div className="professor-courses-page">
      <div className="professor-courses-container">
        <div className="professor-courses-header">
          <h1>My Courses</h1>
          <p>Manage and view your teaching courses</p>
        </div>

        {courses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No Courses Yet</h3>
            <p>You haven't created any courses yet. Start by adding your first course.</p>
            <Link to="/courses/add" className="add-first-course-btn">
              Add Your First Course
            </Link>
          </div>
        ) : (
          <>
            <div className="courses-grid">
              {courses.map((course, idx) => (
                <div key={course.id || course._id || idx} className="course-card">
                  <div className="course-header">
                    <h3 className="course-name">{course.courseName}</h3>
                    <span className="course-code">{course.courseCode}</span>
                  </div>
                  
                  <div className="course-details">
                    {course.department && (
                      <div className="detail-item">
                        <span className="detail-label">Department:</span>
                        <span className="detail-value">{course.department}</span>
                      </div>
                    )}
                    {course.semester && (
                      <div className="detail-item">
                        <span className="detail-label">Semester:</span>
                        <span className="detail-value">{course.semester}</span>
                      </div>
                    )}
                    <div className="detail-item">
                      <span className="detail-label">Enrolled Students:</span>
                      <span className="detail-value enrolled-count">{course.enrolledStudents || 0}</span>
                    </div>
                    {course.slots && course.slots.length > 0 && (
                      <div className="detail-item">
                        <span className="detail-label">Schedule:</span>
                        <div className="schedule-slots">
                          {course.slots.map((slot, slotIdx) => (
                            <div key={slotIdx} className="schedule-slot">
                              <span className="day">{slot.day}</span>
                              <span className="time">{slot.start} - {slot.end}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="course-actions">
                    <Link to={`/attendance/management?course=${course.courseCode}`} className="action-btn primary">
                      Manage Attendance
                    </Link>
                    <button className="action-btn secondary">
                      View Students
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="add-course-section">
              <Link to="/courses/add" className="add-course-btn">
                <span className="btn-icon">+</span>
                Add New Course
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ProfessorCourses
