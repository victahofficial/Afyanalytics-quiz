import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

export default function RegisterPage() {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    const navigate = useNavigate()

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
    })
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
            const response = await fetch(`${apiUrl}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed')
            }

            navigate('/login')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="mx-auto max-w-xl px-6 py-14">
            <div className="rounded-[32px] bg-white p-8 shadow-sm">
                <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-slate-500">Join</p>
                <h1 className="mt-3 text-3xl font-extrabold">Register</h1>
                <p className="mt-2 text-slate-600">Normal member registration now lives on its own page.</p>

                <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
                    <input
                        name="fullName"
                        value={form.fullName}
                        onChange={updateField}
                        placeholder="Full name"
                        className="rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                        required
                    />

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
                        name="phone"
                        value={form.phone}
                        onChange={updateField}
                        placeholder="Phone number"
                        className="rounded-2xl border border-slate-300 px-4 py-3 outline-none"
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
                        className="rounded-2xl bg-[#19b24b] px-4 py-3 font-extrabold text-white"
                    >
                        {loading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>

                <p className="mt-6 text-sm text-slate-600">
                    Already registered?{' '}
                    <Link to="/login" className="font-bold text-[#0d7a52]">
                        Login here
                    </Link>
                </p>
            </div>
        </section>
    )
}