import { useState, useEffect } from 'react'
import { checkAttendance, getCourses } from '../lib/api.js'
import './StudentAttendance.css'

function StudentAttendance() {
  const [courses, setCourses] = useState([])
  const [attendanceData, setAttendanceData] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const userRole = localStorage.getItem('userRole')
  const userId = localStorage.getItem('userId')

  useEffect(() => {
    if (userRole !== 'student') {
      window.location.href = '/courses'
      return
    }
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      const courseData = await getCourses(userId)
      setCourses(courseData)
      // Load attendance for all courses
      loadAllAttendance(courseData)
    } catch (error) {
      console.error('Error loading courses:', error)
      setMessage('Error loading courses')
      setMessageType('error')
    }
  }

  const loadAllAttendance = async (courseList) => {
    setLoading(true)
    try {
      const attendancePromises = courseList.map(async (course) => {
        try {
          const data = await checkAttendance({
            coursecode: course.courseCode,
            studentId: userId
          })
          return { courseCode: course.courseCode, data }
        } catch (error) {
          console.error(`Error loading attendance for ${course.courseCode}:`, error)
          return { courseCode: course.courseCode, data: { presentDates: [] } }
        }
      })

      const results = await Promise.all(attendancePromises)
      const attendanceMap = {}
      results.forEach(({ courseCode, data }) => {
        attendanceMap[courseCode] = data
      })
      setAttendanceData(attendanceMap)
    } catch (error) {
      console.error('Error loading attendance data:', error)
      setMessage('Error loading attendance data')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const handleRefreshAttendance = async () => {
    if (courses.length === 0) return
    await loadAllAttendance(courses)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  const calculateAttendanceStats = (courseCode) => {
    const data = attendanceData[courseCode]
    if (!data || !data.presentDates) return null
    
    const presentDays = data.presentDates.length
    // For now, we'll assume total days is the same as present days
    // In a real implementation, you'd need to track total class days
    const totalDays = Math.max(presentDays, 1) // At least 1 to avoid division by zero
    const attendancePercentage = (presentDays / totalDays) * 100
    
    return {
      totalDays,
      presentDays,
      attendancePercentage: Math.round(attendancePercentage)
    }
  }

  return (
    <div className="student-attendance">
      <div className="container">
        <h1>My Attendance</h1>
        
        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <div className="attendance-controls">
          <button 
            onClick={handleRefreshAttendance}
            disabled={loading}
            className="refresh-btn"
          >
            {loading ? 'Loading...' : 'Refresh Attendance'}
          </button>
        </div>

        {courses.length > 0 && (
          <div className="courses-attendance">
            <h2>My Courses Attendance</h2>
            <div className="courses-grid">
              {courses.map(course => {
                const stats = calculateAttendanceStats(course.courseCode)
                const courseAttendance = attendanceData[course.courseCode]
                return (
                  <div key={course.courseCode} className="course-card">
                    <div className="course-header">
                      <h3>{course.courseName}</h3>
                      <p className="course-code">{course.courseCode}</p>
                    </div>
                    
                    {stats && (
                      <div className="course-stats">
                        <div className="stat-item">
                          <span className="stat-label">Present:</span>
                          <span className="stat-value">{stats.presentDays}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Total:</span>
                          <span className="stat-value">{stats.totalDays}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Rate:</span>
                          <span className="stat-value">{stats.attendancePercentage}%</span>
                        </div>
                      </div>
                    )}

                    <div className="attendance-dates">
                      <h4>Attendance History</h4>
                      {courseAttendance && courseAttendance.presentDates && courseAttendance.presentDates.length > 0 ? (
                        <div className="dates-list">
                          {courseAttendance.presentDates.map((date, index) => (
                            <div key={index} className="date-item present">
                              <span className="status-icon">✓</span>
                              <span className="date-text">{formatDate(date)}</span>
                              <span className="status-text">Present</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="no-data">
                          <p>No attendance records found.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {courses.length === 0 && !loading && (
          <div className="no-courses">
            <p>No courses found. Please contact your administrator.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentAttendance
