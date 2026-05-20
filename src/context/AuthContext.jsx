import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token    = localStorage.getItem('token')
    const username = localStorage.getItem('username')
    const role     = localStorage.getItem('role')
    return token ? { token, username, role } : null
  })

  const login = (data) => {
    localStorage.setItem('token',    data.token)
    localStorage.setItem('username', data.username)
    localStorage.setItem('role',     data.role)
    setUser({ token: data.token, username: data.username, role: data.role })
  }

  const logout = () => {
    localStorage.clear()
    setUser(null)
  }

  const isAdmin = !user ? false : !user.role || user.role.toLowerCase() === 'admin'

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
