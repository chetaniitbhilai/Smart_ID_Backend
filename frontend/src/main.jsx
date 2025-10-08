import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import VerifyOtp from './pages/VerifyOtp.jsx'
import UpcomingClasses from './pages/UpcomingClasses.jsx'
import Courses from './pages/Courses.jsx'
import AddCourse from './pages/AddCourse.jsx'
import StudentComplain from './pages/StudentComplain.jsx'
import TAComplaints from './pages/TAComplaints.jsx'
import RegisterCourse from './pages/RegisterCourse.jsx'
import AttendanceManagement from './pages/AttendanceManagement.jsx'
import StudentAttendance from './pages/StudentAttendance.jsx'
import ProfessorCourses from './pages/ProfessorCourses.jsx'
import Profile from './pages/Profile.jsx'
import ErrorPage from './pages/ErrorPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <Login /> },
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <Signup /> },
      { path: '/verify-otp', element: <VerifyOtp /> },
      { path: '/upcomingclasses', element: <UpcomingClasses /> },
      { path: '/courses', element: <Courses /> },
      { path: '/courses/my-courses', element: <ProfessorCourses /> },
      { path: '/courses/add', element: <AddCourse /> },
      { path: '/complain', element: <StudentComplain /> },
      { path: '/ta/complaints', element: <TAComplaints /> },
      { path: '/courses/register', element: <RegisterCourse /> },
      { path: '/attendance/management', element: <AttendanceManagement /> },
      { path: '/attendance/check', element: <StudentAttendance /> },
      { path: '/profile', element: <Profile /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
