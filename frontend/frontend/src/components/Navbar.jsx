import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <nav className="app-navbar">
      <div className="brand"><span className="brand-dot" />Aivantage</div>
      <div className="nav-user">
        {user && <><span className="nav-avatar">{user.name?.charAt(0)?.toUpperCase() || 'U'}</span><span className="nav-user-name">{user.name}</span></>}
        <button
          className="btn-secondary"
          onClick={() => { logout(); navigate('/login') }}
        >
          Log out
        </button>
      </div>
    </nav>
  )
}
