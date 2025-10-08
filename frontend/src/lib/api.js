const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  
  console.log('Making request to:', url)
  console.log('Request options:', { ...options, headers })
  
  const response = await fetch(url, { ...options, headers, credentials: 'include' })
  const isJson = response.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await response.json() : await response.text()
  
  console.log('Response status:', response.status)
  console.log('Response data:', data)
  
  if (!response.ok) {
    const message = typeof data === 'string' ? data : data?.message || data?.error || `Request failed with status ${response.status}`
    throw new Error(message)
  }
  return data
}

export function login(payload) {
  return request('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) })
}

export function signup(payload) {
  return request('/api/auth/signup', { method: 'POST', body: JSON.stringify(payload) })
}

export function verifyOtp(payload) {
  return request('/api/auth/verify-otp', { method: 'POST', body: JSON.stringify(payload) })
}

// Courses
export function getCourses(userId, userRole) {
  const params = new URLSearchParams()
  if (userId) params.set('userId', userId)
  if (userRole) params.set('role', userRole)
  const qp = params.toString() ? `?${params.toString()}` : ''
  return request(`/course/get_courses${qp}`, { method: 'GET' })
}

export function addCourse(payload) {
  return request('/course/add_course', { method: 'POST', body: JSON.stringify(payload) })
}

export function getUpcoming({ studentId, professorId } = {}) {
  const params = new URLSearchParams()
  if (studentId) params.set('studentId', studentId)
  if (!studentId && professorId) params.set('professorId', professorId)
  const qp = params.toString() ? `?${params.toString()}` : ''
  return request(`/course/upcoming${qp}`, { method: 'GET' })
}

export function registerCourse(payload) {
  return request('/course/register', { method: 'POST', body: JSON.stringify(payload) })
}

export function getCourseStudents(coursecode) {
  const qp = coursecode ? `?coursecode=${encodeURIComponent(coursecode)}` : ''
  return request(`/course/students${qp}`, { method: 'GET' })
}

export function logout() {
  return request('/api/auth/logout', { method: 'POST' })
}

export function getProfile() {
  return request('/api/auth/profile', { method: 'GET' })
}

// Complaints
export function addComplain(payload) {
  return request('/complain/add_complain', { method: 'POST', body: JSON.stringify(payload) })
}

export function listComplaintsForTA(taName) {
  const qp = taName ? `?taName=${encodeURIComponent(taName)}` : ''
  return request(`/complain/get_complain${qp}`, { method: 'GET' })
}

export function resolveComplain(payload) {
  return request('/complain/resolve_complain', { method: 'POST', body: JSON.stringify(payload) })
}


// Attendance
export function addAttendance(payload) {
  return request('/attendance/add_attendance', { method: 'POST', body: JSON.stringify(payload) })
}

export function checkAttendance(payload) {
  return request('/attendance/check_attendance', { method: 'POST', body: JSON.stringify(payload) })
}

export function updateAttendance(payload) {
  return request('/attendance/update_attendance', { method: 'POST', body: JSON.stringify(payload) })
}

export function bulkAttendance(payload) {
  return request('/attendance/bulk_attendance', { method: 'POST', body: JSON.stringify(payload) })
}

export { BASE_URL }


