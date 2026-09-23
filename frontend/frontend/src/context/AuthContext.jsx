import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('vantage_user')
    return saved ? JSON.parse(saved) : null
  })
  const [token, setToken] = useState(() => sessionStorage.getItem('vantage_token'))

  function login(newToken, newUser) {
    sessionStorage.setItem('vantage_token', newToken)
    sessionStorage.setItem('vantage_user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }

  function logout() {
    sessionStorage.removeItem('vantage_token')
    sessionStorage.removeItem('vantage_user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
