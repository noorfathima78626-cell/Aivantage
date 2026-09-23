import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'

import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import InterviewSession from './pages/InterviewSession.jsx'
import AptitudeSession from './pages/AptitudeSession.jsx'
import Results from './pages/Results.jsx'
import Home from './pages/Home.jsx'
import OwnerLogin from './pages/OwnerLogin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
      />
      <Route
        path="/session/:sessionId"
        element={<ProtectedRoute><InterviewSession /></ProtectedRoute>}
      />
      <Route
        path="/aptitude/:sessionId"
        element={<ProtectedRoute><AptitudeSession /></ProtectedRoute>}
      />
      <Route
        path="/results/:sessionId"
        element={<ProtectedRoute><Results /></ProtectedRoute>}
      />
      <Route path="/owner-login" element={<OwnerLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  )
}
