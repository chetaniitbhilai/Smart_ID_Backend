
import { useState } from 'react'

function AuthForm({ mode = 'login', onSubmit }) {
  const isSignup = mode === 'signup'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [department, setDepartment] = useState('')
  const [studentId, setStudentId] = useState('')
  const [role, setRole] = useState('')
  const [professorId, setProfessorId] = useState('')
  const [taId, setTaId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      if (isSignup) {
        await onSubmit({ 
          name, 
          email, 
          password, 
          confirmPassword, 
          department, 
          studentId, 
          role, 
          professorId, 
          taId 
        })
      } else {
        await onSubmit({ name, email, password })
      }
    } catch (err) {
      setError(err.message || 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {isSignup && (
        <>
          <label>
            Name
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Department
            <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} required />
          </label>
          <label>
            Role
            <select value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="professor">Professor</option>
              <option value="ta">TA</option>
            </select>
          </label>
          {role === 'student' && (
            <label>
              Student ID
              <input type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} required />
            </label>
          )}
          {role === 'professor' && (
            <label>
              Professor ID
              <input type="text" value={professorId} onChange={(e) => setProfessorId(e.target.value)} required />
            </label>
          )}
          {role === 'ta' && (
            <label>
              TA ID
              <input type="text" value={taId} onChange={(e) => setTaId(e.target.value)} required />
            </label>
          )}
        </>
      )}
      <label>
        Email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label>
        Password
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      {isSignup && (
        <label>
          Confirm Password
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </label>
      )}
      {error && <p className="error-message">{error}</p>}
      <button type="submit" disabled={submitting}>
        {submitting ? (isSignup ? 'Creating...' : 'Signing in...') : isSignup ? 'Create account' : 'Login'}
      </button>
    </form>
  )
}

export default AuthForm


