import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import ROLE from '../common/role'

const ProtectedRoute = ({ children }) => {
    const user = useSelector(state => state?.user?.user)

    // Not logged in → redirect to login
    if (!user?._id) {
        return <Navigate to="/login" replace />
    }

    // Logged in but not admin → redirect to home
    if (user?.role !== ROLE.ADMIN) {
        return <Navigate to="/" replace />
    }

    // Admin → allow access
    return children
}

export default ProtectedRoute