import React from 'react'
import { useAuthStore } from '../store/auth.store.js'
import { Navigate } from 'react-router-dom'

const RedirectRoute = ({ children }) => {
  const { user, loading } = useAuthStore()

  if (loading) {
    return null
  }

  if (!user) {
    return children
  }
  return <Navigate to="/" />
}

export default RedirectRoute