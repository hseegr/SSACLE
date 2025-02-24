import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null)

  useEffect(() => {
    const savedRole = localStorage.getItem('role')
    if (savedRole) {
      setRole(savedRole)
    }
  }, [])

  const login = (roleValue) => {
    localStorage.setItem('role', roleValue)
    setRole(roleValue)
  }

  const logout = () => {
    localStorage.removeItem('role')
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
