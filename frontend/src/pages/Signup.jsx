import { Link, useNavigate } from 'react-router-dom'
import AuthForm from '../components/AuthForm.jsx'
import { signup } from '../lib/api.js'

function Signup() {
  const navigate = useNavigate()
  const handleSubmit = async ({ name, email, password, confirmPassword, department, studentId, role, professorId, taId }) => {
    try {
      console.log('Signup payload:', { name, email, password, confirmPassword, department, studentId, role, professorId, taId })
      const res = await signup({ 
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
      console.log('Signup response:', res)
      // Redirect directly to upcoming classes
      navigate('/upcomingclasses')
      return res
    } catch (error) {
      console.error('Signup error:', error)
      // Re-throw the error so AuthForm can display it
      throw error
    }
  }

  return (
    <div className="auth-container">
      <h2>Signup</h2>
      <AuthForm mode="signup" onSubmit={handleSubmit} />
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  )
}

export default Signup


