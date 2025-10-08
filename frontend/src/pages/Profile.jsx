import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProfile } from '../lib/api.js'
import './Profile.css'

function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const profileData = await getProfile()
      setUser(profileData)
    } catch (error) {
      console.error('Error loading profile:', error)
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleEditProfile = () => {
    // Navigate to edit profile page (you can implement this later)
    console.log('Edit profile clicked')
  }

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'student':
        return 'Student'
      case 'ta':
        return 'Teaching Assistant'
      case 'professor':
        return 'Professor'
      default:
        return role
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'student':
        return '🎓'
      case 'ta':
        return '👨‍🏫'
      case 'professor':
        return '👨‍🎓'
      default:
        return '👤'
    }
  }

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="error-message">
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={loadProfile} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="error-message">
            <h2>No Profile Found</h2>
            <p>Unable to load your profile information.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-circle">
              <span className="avatar-text">{user.name?.charAt(0)?.toUpperCase() || 'U'}</span>
            </div>
            <div className="role-badge">
              <span className="role-icon">{getRoleIcon(user.role)}</span>
              <span className="role-text">{getRoleDisplayName(user.role)}</span>
            </div>
          </div>
          <h1 className="profile-name">{user.name}</h1>
          <p className="profile-email">{user.email}</p>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h2>Personal Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Full Name</label>
                <div className="info-value">{user.name}</div>
              </div>
              <div className="info-item">
                <label>Email</label>
                <div className="info-value">{user.email}</div>
              </div>
              <div className="info-item">
                <label>Department</label>
                <div className="info-value">{user.department || 'Not specified'}</div>
              </div>
              <div className="info-item">
                <label>Role</label>
                <div className="info-value role-value">
                  <span className="role-icon">{getRoleIcon(user.role)}</span>
                  {getRoleDisplayName(user.role)}
                </div>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>Academic Information</h2>
            <div className="info-grid">
              {user.role === 'student' && user.studentId && (
                <div className="info-item">
                  <label>Student ID</label>
                  <div className="info-value">{user.studentId}</div>
                </div>
              )}
              {user.role === 'ta' && user.taId && (
                <div className="info-item">
                  <label>TA ID</label>
                  <div className="info-value">{user.taId}</div>
                </div>
              )}
              {user.role === 'professor' && user.professorId && (
                <div className="info-item">
                  <label>Professor ID</label>
                  <div className="info-value">{user.professorId}</div>
                </div>
              )}
            </div>
          </div>

          <div className="profile-actions">
            <button onClick={handleEditProfile} className="edit-profile-btn">
              Edit Profile
            </button>
            <button onClick={() => navigate(-1)} className="back-btn">
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
