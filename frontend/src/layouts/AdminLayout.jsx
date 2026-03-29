import { Link, NavLink, Outlet, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'

const adminLinkClass = ({ isActive }) =>
    `rounded-2xl px-4 py-3 text-sm font-bold transition ${isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
    }`

export default function AdminLayout() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[280px_1fr]">
                <aside className="border-r border-slate-200 bg-white p-6">
                    <Link to="/" className="block">
                        <p className="text-2xl font-extrabold text-slate-950">Flamingo Admin</p>
                        <p className="mt-1 text-sm text-slate-500">Manage the whole website</p>
                    </Link>

                    <div className="mt-8 rounded-3xl bg-slate-100 p-4">
                        <p className="font-extrabold text-slate-900">{user?.fullName}</p>
                        <p className="text-sm text-slate-500">{user?.role}</p>
                    </div>

                    <nav className="mt-8 grid gap-2">
                        <NavLink to="/admin/dashboard" className={adminLinkClass}>Dashboard</NavLink>
                        <NavLink to="/admin/shop" className={adminLinkClass}>Shop Manager</NavLink>
                        <NavLink to="/admin/news" className={adminLinkClass}>News Manager</NavLink>
                        <NavLink to="/admin/letters" className={adminLinkClass}>Letters Manager</NavLink>
                        <NavLink to="/admin/photos" className={adminLinkClass}>Gallery Manager</NavLink>
                        <NavLink to="/admin/notices" className={adminLinkClass}>Meeting Notices</NavLink>
                    </nav>

                    <div className="mt-8 grid gap-3">
                        <Link
                            to="/"
                            className="rounded-2xl border border-slate-300 px-4 py-3 text-center text-sm font-bold text-slate-800"
                        >
                            Back to site
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-bold text-white"
                        >
                            Logout
                        </button>
                    </div>
                </aside>

                <main className="p-6 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}