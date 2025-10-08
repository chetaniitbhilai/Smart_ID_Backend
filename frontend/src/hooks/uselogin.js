import { useState } from 'react'
import { login as apiLogin } from '../lib/api.js'

function useLogin() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const login = async (username, password) => {
    setLoading(true)
    setError('')
    try {
      // Backend expects email+password
      const res = await apiLogin({ email: username, password })
      // Persist minimal auth info for subsequent requests
      const userId = res?._id || res?.user?._id || res?.id
      const userName = res?.name || res?.user?.name
      const userRole = res?.role || res?.user?.role
      const taId = res?.taId || res?.user?.taId
      const professorId = res?.professorId || res?.user?.professorId
      
      if (userId) {
        localStorage.setItem('userId', String(userId))
      }
      if (userName) {
        localStorage.setItem('userName', String(userName))
      }
      if (userRole) {
        localStorage.setItem('userRole', String(userRole))
      }
      if (taId) {
        localStorage.setItem('taId', String(taId))
      }
      if (professorId) {
        localStorage.setItem('professorId', String(professorId))
      }
      return res
    } catch (e) {
      setError(e.message || 'Login failed')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { login, loading, error }
}

export default useLogin


