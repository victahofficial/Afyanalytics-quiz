import { Link, NavLink, Outlet } from 'react-router'
import { useAuth } from '../context/AuthContext'

const navLinkClass = ({ isActive }) =>
    `text-sm font-bold transition ${isActive ? 'text-slate-950' : 'text-slate-500 hover:text-slate-900'}`

export default function PublicLayout() {
    const { isAdmin } = useAuth()

    return (
        <div className="min-h-screen bg-slate-100">
            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0d7a52] text-lg font-extrabold text-white">
                            F
                        </div>
                        <div>
                            <p className="text-lg font-extrabold text-slate-950">Flamingo Rovers</p>
                            <p className="text-xs text-slate-500">Scouts & Community</p>
                        </div>
                    </Link>

                    <nav className="hidden items-center gap-8 md:flex">
                        <NavLink to="/" end className={navLinkClass}>Home</NavLink>
                        <NavLink to="/shop" className={navLinkClass}>Shop</NavLink>
                        <NavLink to="/news" className={navLinkClass}>News</NavLink>
                        <NavLink to="/letters" className={navLinkClass}>Letters</NavLink>
                        <NavLink to="/photos" className={navLinkClass}>Photos</NavLink>
                    </nav>

                    <div className="flex items-center gap-3">
                        {isAdmin && (
                            <Link
                                to="/admin/dashboard"
                                className="hidden rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-800 md:inline-flex"
                            >
                                Admin
                            </Link>
                        )}

                        <Link
                            to="/login"
                            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-100"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </header>

            <Outlet />

            <footer className="mt-16 bg-slate-900 text-white">
                <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-3">
                    <div>
                        <h3 className="text-xl font-extrabold">Flamingo Rovers</h3>
                        <p className="mt-3 text-sm leading-7 text-slate-300">
                            Service, leadership, scouting, stories, shop, notices, and member community in one place.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-sm font-extrabold uppercase tracking-[0.2em] text-slate-400">Explore</h4>
                        <div className="mt-4 grid gap-3 text-sm text-slate-300">
                            <Link to="/shop">Shop</Link>
                            <Link to="/news">News</Link>
                            <Link to="/letters">Letters</Link>
                            <Link to="/photos">Photos</Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-extrabold uppercase tracking-[0.2em] text-slate-400">Account</h4>
                        <div className="mt-4 grid gap-3 text-sm text-slate-300">
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}