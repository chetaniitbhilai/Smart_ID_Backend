import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addCourse } from '../lib/api.js'

function AddCourse() {
  const [course, setCourse] = useState('')
  const [coursecode, setCoursecode] = useState('')
  const [department, setDepartment] = useState('')
  const [semester, setSemester] = useState('')
  const [slots, setSlots] = useState([{ day: 'mon', start: '10:00', end: '11:00' }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const professorId = localStorage.getItem('userId')
      const userRole = localStorage.getItem('userRole')
      if (!professorId) {
        setError('Please login first')
        return
      }
      if (userRole !== 'professor') {
        setError('Only professors can add courses')
        return
      }
      await addCourse({ 
        course, 
        coursecode, 
        professorId, 
        department: department || undefined,
        semester: semester || undefined,
        slots
      })
      setSuccess('Course added successfully!')
      setTimeout(() => navigate('/courses'), 1500)
    } catch (e) {
      setError(e.message || 'Failed to add course')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <h2>Add Course</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Course Name
          <input type="text" value={course} onChange={(e) => setCourse(e.target.value)} required />
        </label>
        <label>
          Course Code
          <input type="text" value={coursecode} onChange={(e) => setCoursecode(e.target.value)} required />
        </label>
        <label>
          Department
          <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} />
        </label>
        <label>
          Semester
          <input type="text" value={semester} onChange={(e) => setSemester(e.target.value)} />
        </label>
        <div>
          <strong>Slots</strong>
          {slots.map((s, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 8, alignItems: 'end', marginTop: 8 }}>
              <label>
                Day
                <select value={s.day} onChange={(e) => {
                  const next = [...slots];
                  next[idx] = { ...next[idx], day: e.target.value };
                  setSlots(next);
                }}>
                  <option value="sun">Sun</option>
                  <option value="mon">Mon</option>
                  <option value="tue">Tue</option>
                  <option value="wed">Wed</option>
                  <option value="thu">Thu</option>
                  <option value="fri">Fri</option>
                  <option value="sat">Sat</option>
                </select>
              </label>
              <label>
                Start
                <input type="time" value={s.start} onChange={(e) => {
                  const next = [...slots];
                  next[idx] = { ...next[idx], start: e.target.value };
                  setSlots(next);
                }} required />
              </label>
              <label>
                End
                <input type="time" value={s.end} onChange={(e) => {
                  const next = [...slots];
                  next[idx] = { ...next[idx], end: e.target.value };
                  setSlots(next);
                }} required />
              </label>
              <button type="button" onClick={() => setSlots((prev) => prev.filter((_, i) => i !== idx))} disabled={slots.length === 1}>Remove</button>
            </div>
          ))}
          <div>
            <button type="button" onClick={() => setSlots((prev) => [...prev, { day: 'mon', start: '10:00', end: '11:00' }])}>Add Slot</button>
          </div>
        </div>
        {error && <p className="error-message">{error}</p>}
        {success && <p style={{color: 'green'}}>{success}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Add Course'}</button>
      </form>
    </div>
  )
}

export default AddCourse


