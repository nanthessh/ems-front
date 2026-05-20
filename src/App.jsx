import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login         from './pages/Login'
import Register      from './pages/Register'
import Dashboard     from './pages/Dashboard'
import Employees     from './pages/Employees'
import Departments   from './pages/Departments'
import Attendance    from './pages/Attendance'
import Leave         from './pages/Leave'
import Payroll       from './pages/Payroll'
import Announcements from './pages/Announcements'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

const privateRoutes = [
  { path: '/dashboard',     element: <Dashboard /> },
  { path: '/employees',     element: <Employees /> },
  { path: '/departments',   element: <Departments /> },
  { path: '/attendance',    element: <Attendance /> },
  { path: '/leave',         element: <Leave /> },
  { path: '/payroll',       element: <Payroll /> },
  { path: '/announcements', element: <Announcements /> },
]

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          {privateRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={<PrivateRoute>{element}</PrivateRoute>} />
          ))}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
