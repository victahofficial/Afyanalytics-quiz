import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    const { login } = useAuth()
    const navigate = useNavigate()

    const [form, setForm] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    function updateField(e) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const response = await fetch(`${apiUrl}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Login failed')
            }

            login(data)

            if (data.user.role === 'admin' || data.user.role === 'leader') {
                navigate('/admin/dashboard')
            } else {
                navigate('/')
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="mx-auto max-w-xl px-6 py-14">
            <div className="rounded-[32px] bg-white p-8 shadow-sm">
                <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-slate-500">Account</p>
                <h1 className="mt-3 text-3xl font-extrabold">Login</h1>
                <p className="mt-2 text-slate-600">Members and admins sign in here.</p>

                <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={updateField}
                        placeholder="Email"
                        className="rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                        required
                    />

                    <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={updateField}
                        placeholder="Password"
                        className="rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                        required
                    />

                    {error ? (
                        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                            {error}
                        </div>
                    ) : null}

                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-2xl bg-slate-900 px-4 py-3 font-extrabold text-white"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="mt-6 text-sm text-slate-600">
                    No account yet?{' '}
                    <Link to="/register" className="font-bold text-[#0d7a52]">
                        Register here
                    </Link>
                </p>
            </div>
        </section>
    )
}