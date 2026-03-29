import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ adminOnly = false }) {
    const { isLoggedIn, isAdmin } = useAuth()

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />
    }

    if (adminOnly && !isAdmin) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}