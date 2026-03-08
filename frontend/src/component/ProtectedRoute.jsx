import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = window.localStorage.getItem('token')
  const user = JSON.parse(window.localStorage.getItem('user') || 'null')
  const isLoggedIn = window.localStorage.getItem('isLoggedIn') === 'true'

  // 1. No token or not logged in → redirect to login
  if (!token || !isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  // 2. Check token expiry by decoding the payload
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const isExpired = Date.now() / 1000 > payload.exp

    if (isExpired) {
      // Clean up stale session
      window.localStorage.removeItem('token')
      window.localStorage.removeItem('user')
      window.localStorage.removeItem('isLoggedIn')
      return <Navigate to="/login" replace />
    }
  } catch (err) {
    // Malformed token
    return <Navigate to="/login" replace />
  }

  // 3. Role check — only if requiredRole is passed
  if (requiredRole && user?.role !== requiredRole) {
    // Logged in but wrong role → redirect to their allowed page
    if (user?.role === 'admin') return <Navigate to="/admin" replace />
    if (user?.role === 'user') return <Navigate to="/" replace />
    return <Navigate to="/login" replace />
  }

  // 4. All checks passed → render the page
  return children
}

export default ProtectedRoute






