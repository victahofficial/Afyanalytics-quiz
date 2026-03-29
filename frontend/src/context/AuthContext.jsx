import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token') || '')
    const [user, setUser] = useState(() => {
        const raw = localStorage.getItem('user')
        return raw ? JSON.parse(raw) : null
    })

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token)
        } else {
            localStorage.removeItem('token')
        }
    }, [token])

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user))
        } else {
            localStorage.removeItem('user')
        }
    }, [user])

    function login(payload) {
        setToken(payload.token)
        setUser(payload.user)
    }

    function logout() {
        setToken('')
        setUser(null)
    }

    const value = useMemo(
        () => ({
            token,
            user,
            isLoggedIn: !!token,
            isAdmin: user?.role === 'admin' || user?.role === 'leader',
            login,
            logout,
        }),
        [token, user]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
    return ctx
}