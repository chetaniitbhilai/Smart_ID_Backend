import { useState, useEffect } from 'react'
import { addAttendance, updateAttendance, getCourses, getCourseStudents, bulkAttendance } from '../lib/api.js'
import './AttendanceManagement.css'

function AttendanceManagement() {
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState('')
  const [attendanceDate, setAttendanceDate] = useState('')
  const [studentList, setStudentList] = useState([])
  const [isHoliday, setIsHoliday] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const userRole = localStorage.getItem('userRole')
  const userId = localStorage.getItem('userId')
  const taId = localStorage.getItem('taId')
  const professorId = localStorage.getItem('professorId')

  useEffect(() => {
    if (userRole !== 'ta' && userRole !== 'professor') {
      window.location.href = '/courses'
      return
    }
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      console.log('Loading courses for:', { userId, userRole })
      const courseData = await getCourses(userId, userRole)
      console.log('Course data received:', courseData)
      setCourses(courseData)
    } catch (error) {
      console.error('Error loading courses:', error)
      setMessage('Error loading courses')
      setMessageType('error')
    }
  }

  const handleCourseSelect = async (courseCode) => {
    setSelectedCourse(courseCode)
    if (!courseCode) {
      setStudentList([])
      return
    }
    
    try {
      const response = await getCourseStudents(courseCode)
      setStudentList(response.students || [])
    } catch (error) {
      console.error('Error loading students:', error)
      setMessage('Error loading students for this course')
      setMessageType('error')
      setStudentList([])
    }
  }

  const handleMarkAttendance = async (studentId, isPresent) => {
    if (!selectedCourse || !attendanceDate) {
      setMessage('Please select a course and date')
      setMessageType('error')
      return
    }

    setLoading(true)
    try {
      if (isPresent) {
        // Use addAttendance for marking present
        const payload = {
          coursecode: selectedCourse,
          studentId: studentId,
          date: attendanceDate,
          isHoliday: isHoliday
        }
        await addAttendance(payload)
      } else {
        // For marking absent, use updateAttendance (requires taId)
        if (userRole === 'ta' && !taId) {
          setMessage('TA ID not found. Please contact administrator.')
          setMessageType('error')
          return
        }
        
        await updateAttendance({
          coursecode: selectedCourse,
          taId: taId || professorId,
          studentId: studentId,
          date: attendanceDate
        })
      }

      setMessage(`Attendance ${isPresent ? 'marked' : 'updated'} successfully`)
      setMessageType('success')
    } catch (error) {
      console.error('Error marking attendance:', error)
      setMessage('Error marking attendance')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const handleBulkAttendance = async () => {
    if (!selectedCourse || !attendanceDate) {
      setMessage('Please select a course and date')
      setMessageType('error')
      return
    }

    if (studentList.length === 0) {
      setMessage('No students found for this course')
      setMessageType('error')
      return
    }

    setLoading(true)
    try {
      // Use the new bulk attendance API
      const studentIds = studentList.map(student => student._id)
      
      await bulkAttendance({
        coursecode: selectedCourse,
        studentIds: studentIds,
        date: attendanceDate,
        isHoliday: isHoliday
      })

      setMessage(`Bulk attendance marked successfully for ${studentIds.length} students`)
      setMessageType('success')
    } catch (error) {
      console.error('Error marking bulk attendance:', error)
      setMessage('Error marking bulk attendance')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="attendance-management">
      <div className="container">
        <h1>Attendance Management</h1>
        
        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <div className="attendance-form">
          <div className="form-group">
            <label htmlFor="course">Select Course:</label>
            <select 
              id="course"
              value={selectedCourse} 
              onChange={(e) => handleCourseSelect(e.target.value)}
              required
            >
              <option value="">Choose a course</option>
              {courses.length === 0 ? (
                <option value="" disabled>No courses found</option>
              ) : (
                courses.map(course => (
                  <option key={course._id} value={course.courseCode || course.coursecode}>
                    {course.courseCode || course.coursecode} - {course.courseName}
                  </option>
                ))
              )}
            </select>
            {courses.length === 0 && (
              <p className="no-courses-message">
                No courses found. Make sure you have created courses or are assigned to courses.
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="date">Attendance Date:</label>
            <input
              type="date"
              id="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={isHoliday}
                onChange={(e) => setIsHoliday(e.target.checked)}
              />
              Mark as Holiday
            </label>
          </div>

          {selectedCourse && (
            <div className="attendance-actions">
              <button 
                onClick={handleBulkAttendance}
                disabled={loading}
                className="bulk-attendance-btn"
              >
                {loading ? 'Processing...' : 'Mark All Present'}
              </button>
            </div>
          )}
        </div>

        {selectedCourse && studentList.length > 0 && (
          <div className="student-list">
            <h2>Students in {selectedCourse}</h2>
            <div className="student-grid">
              {studentList.map(student => (
                <div key={student._id} className="student-card">
                  <div className="student-info">
                    <h3>{student.name}</h3>
                    <p>ID: {student.studentId}</p>
                  </div>
                  <div className="attendance-actions">
                    <button 
                      onClick={() => handleMarkAttendance(student._id, true)}
                      disabled={loading}
                      className="present-btn"
                    >
                      Present
                    </button>
                    <button 
                      onClick={() => handleMarkAttendance(student._id, false)}
                      disabled={loading}
                      className="absent-btn"
                    >
                      Absent
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AttendanceManagement
