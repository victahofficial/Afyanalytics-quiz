import { useEffect, useState, useCallback } from 'react'
import {
    Routes,
    Route,
    Link,
    NavLink,
    Navigate,
    Outlet,
    useNavigate,
    useParams,
} from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const defaultProducts = [
    {
        id: 1,
        name: 'Flamingo Scout Scarf',
        price: 850,
        category: 'Scarfs',
        image: '/images/scarf.jpg',
        description: 'Official-style scarf for meetings, camps, parades, and major Flamingo events.',
    },
    {
        id: 2,
        name: 'Classic Wooden Woggle',
        price: 300,
        category: 'Woggles',
        image: '/images/woggle.jpg',
        description: 'Simple and clean woggle for everyday uniform use.',
    },
    {
        id: 3,
        name: 'Flamingo Activity Shirt',
        price: 1600,
        category: 'Uniform',
        image: '/images/shirt.jpg',
        description: 'Comfortable activity shirt for service days, camps, and outreach work.',
    },
    {
        id: 4,
        name: 'Merit Badge Pack',
        price: 500,
        category: 'Badges',
        image: '/images/badge.jpg',
        description: 'Starter badge pack for achievements, patrol identity, and rank display.',
    },
]

const newsItems = [
    {
        id: 1,
        title: 'Community Cleanup Drive',
        category: 'Service',
        text: 'Members are invited for the monthly cleanup and awareness activity around campus and nearby neighbourhoods.',
    },
    {
        id: 2,
        title: 'Band Practice Schedule Updated',
        category: 'Training',
        text: 'Weekday practice remains active with a refreshed timetable for new and returning members.',
    },
    {
        id: 3,
        title: 'Peace Campaign Feature Story',
        category: 'News',
        text: 'A new feature story celebrates the impact of youth-led advocacy and service in the local community.',
    },
]

const letterItems = [
    {
        id: 1,
        title: 'Chairperson Letter',
        date: 'March 2026',
        text: 'A short message on growth, service, discipline, and what the next season looks like for Scouting for Life.',
    },
    {
        id: 2,
        title: 'Monthly Newsletter',
        date: 'February 2026',
        text: 'Highlights from field activities, leadership updates, upcoming events, and member spotlights.',
    },
    {
        id: 3,
        title: 'Projects Brief',
        date: 'January 2026',
        text: 'A quick round-up of active projects, volunteer opportunities, and outreach work.',
    },
]

const photoItems = [
    { id: 1, title: 'Camp Activity', image: '/images/photo1.jpg' },
    { id: 2, title: 'Parade Day', image: '/images/photo2.jpg' },
    { id: 3, title: 'Tree Planting', image: '/images/photo3.jpg' },
    { id: 4, title: 'Scout Gathering', image: '/images/photo4.jpg' },
]

function getStoredUser() {
    try {
        const raw = localStorage.getItem('flamingo_user')
        return raw ? JSON.parse(raw) : null
    } catch {
        return null
    }
}

function getStoredToken() {
    return localStorage.getItem('flamingo_token') || ''
}

export default function App() {
    const [token, setToken] = useState(getStoredToken())
    const [user, setUser] = useState(getStoredUser())

    useEffect(() => {
        if (token) localStorage.setItem('flamingo_token', token)
        else localStorage.removeItem('flamingo_token')
    }, [token])

    useEffect(() => {
        if (user) localStorage.setItem('flamingo_user', JSON.stringify(user))
        else localStorage.removeItem('flamingo_user')
    }, [user])

    function handleLogin(data) {
        setToken(data.token)
        setUser(data.user)
    }

    function handleLogout() {
        setToken('')
        setUser(null)
    }

    const isAdmin = user?.role === 'admin' || user?.role === 'leader' || user?.role === 'superadmin'
    const isSuperAdmin = user?.role === 'superadmin'

    return (
        <Routes>
            <Route element={<PublicLayout user={user} isAdmin={isAdmin} onLogout={handleLogout} />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/letters" element={<LettersPage />} />
                <Route path="/photos" element={<PhotosPage />} />
                <Route path="/downloads" element={<DownloadsPage />} />
                <Route path="/constitution" element={<ConstitutionPage />} />
                <Route path="/page/:slug" element={<ContentPage />} />
                <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                <Route path="/register" element={<RegisterPage />} />
            </Route>

            <Route
                path="/admin"
                element={
                    isAdmin ? (
                        <AdminLayout user={user} onLogout={handleLogout} />
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
            >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard isSuperAdmin={isSuperAdmin} user={user} token={token} />} />
                <Route path="shop" element={<AdminShopPage />} />
                <Route path="news" element={<AdminNewsPage />} />
                <Route path="letters" element={<AdminLettersPage />} />
                <Route path="photos" element={<AdminPhotosPage />} />
                <Route path="notices" element={<AdminNoticesPage />} />
                <Route path="users" element={<AdminUsersPage token={token} />} />
                <Route path="audit-logs" element={<AdminAuditLogPage token={token} />} />
                <Route path="homepage-editor" element={<AdminHomepageEditor token={token} />} />
                <Route path="downloads" element={<AdminDownloadsManager token={token} />} />
                <Route path="constitution" element={<AdminConstitutionManager token={token} />} />
            </Route>
        </Routes>
    )
}

function PublicLayout({ user, isAdmin, onLogout }) {
    return (
        <div className="site-shell">
            <header className="topbar">
                <div className="container topbar-inner" style={{ flexWrap: 'nowrap' }}>
                    <div className="brand-group">
                        <Link to="/" className="brand">
                            <div className="brand-mark">F</div>
                            <div>
                                <div className="brand-title" style={{ fontSize: '18px' }}>Flamingo Rover Scouts</div>
                                <div className="brand-subtitle">Scouts & Community</div>
                            </div>
                        </Link>

                        <div className="social-strip">
                            <a href="https://www.instagram.com/flamingoroverscouts/" target="_blank" rel="noopener noreferrer" title="Instagram">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                            </a>
                            <a href="https://x.com/flamingorovers" target="_blank" rel="noopener noreferrer" title="X (Twitter)">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                            </a>
                            <a href="https://www.facebook.com/flamingoroverscouts" target="_blank" rel="noopener noreferrer" title="Facebook">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                            </a>
                            <a href="https://www.tiktok.com/@flamingoroverscouts" target="_blank" rel="noopener noreferrer" title="TikTok">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                            </a>
                            <a href="https://www.youtube.com/@flamingoroverscouts" target="_blank" rel="noopener noreferrer" title="YouTube">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                            </a>
                        </div>
                    </div>

                    <nav className="topnav">
                        <NavLink to="/" end className={({ isActive }) => navClass(isActive)}>
                            Home
                        </NavLink>
                        <div className="nav-dropdown">
                            <span className="nav-link" style={{ cursor: 'pointer' }}>Who We Are ▾</span>
                            <div className="dropdown-menu">
                                <Link to="/page/scout-movement">Scout Movement</Link>
                                <Link to="/page/scouting-education">Scouting Education</Link>
                                <Link to="/page/scout-method">Scout Method</Link>
                                <Link to="/page/scout-promise-law">Scout Promise & Law</Link>
                                <Link to="/page/scouting-history">Scouting's History</Link>
                                <Link to="/page/about-us">About Us</Link>
                            </div>
                        </div>
                        <div className="nav-dropdown">
                            <span className="nav-link" style={{ cursor: 'pointer' }}>What We Do ▾</span>
                            <div className="dropdown-menu">
                                <Link to="/page/environment">Environment</Link>
                                <Link to="/page/education">Education</Link>
                                <Link to="/page/peace">Peace</Link>
                                <Link to="/page/community-service">Community Service</Link>
                                <Link to="/page/events-camps">Events & Camps</Link>
                            </div>
                        </div>
                        <NavLink to="/shop" className={({ isActive }) => navClass(isActive)}>
                            Shop
                        </NavLink>
                        <NavLink to="/news" className={({ isActive }) => navClass(isActive)}>
                            News
                        </NavLink>
                        <div className="nav-dropdown">
                            <span className="nav-link" style={{ cursor: 'pointer' }}>Resources ▾</span>
                            <div className="dropdown-menu">
                                <Link to="/letters">Letters & Newsletters</Link>
                                <Link to="/photos">Photo Gallery</Link>
                                <Link to="/downloads">Downloads</Link>
                                <Link to="/constitution">Constitution</Link>
                            </div>
                        </div>
                    </nav>

                    <div className="topbar-actions">
                        {user ? (
                            <>
                                {isAdmin && (
                                    <Link to="/admin/dashboard" className="btn btn-light">
                                        Admin
                                    </Link>
                                )}
                                <button className="btn btn-dark" onClick={onLogout}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-light" style={{ padding: '8px 20px' }}>
                                    Login
                                </Link>
                                <Link to="/register" className="btn" style={{ background: '#62259D', color: 'white', padding: '8px 20px' }}>
                                    Join Scouting
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <Outlet />

            <footer className="footer">
                <div className="container footer-grid">
                    <div>
                        <h3>Scouting for Life</h3>
                        <p>
                            Public website for scouting stories, photos, shop items, letters,
                            and community updates.
                        </p>
                    </div>

                    <div>
                        <h4>Explore</h4>
                        <div className="footer-links">
                            <Link to="/shop">Shop</Link>
                            <Link to="/news">News</Link>
                            <Link to="/letters">Letters</Link>
                            <Link to="/photos">Photos</Link>
                        </div>
                    </div>

                    <div>
                        <h4>Account</h4>
                        <div className="footer-links">
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

function HomePage() {
    const [settings, setSettings] = useState(null)
    const [shopProducts, setShopProducts] = useState([])

    useEffect(() => {
        fetch(`${API_URL}/api/settings/public`)
            .then((r) => r.json())
            .then((data) => setSettings(data))
            .catch(() => {})
        fetch(`${API_URL}/api/products/public`)
            .then((r) => r.json())
            .then((data) => { if (Array.isArray(data)) setShopProducts(data) })
            .catch(() => {})
    }, [])

    const s = settings || {}
    const dynNews = (() => { try { return JSON.parse(s.newsItems || '[]') } catch { return newsItems } })()
    const dynLetters = (() => { try { return JSON.parse(s.letterItems || '[]') } catch { return letterItems } })()
    const dynGallery = (() => { try { return JSON.parse(s.galleryItems || '[]') } catch { return photoItems } })()
    const displayProducts = shopProducts.length > 0 ? shopProducts.slice(0, 4) : defaultProducts.slice(0, 4)

    const heroSlides = (() => {
        try { const sl = JSON.parse(s.heroSlides || '[]'); return sl.length > 0 ? sl : [] } catch { return [] }
    })()
    const slideImages = heroSlides.length > 0 ? heroSlides : (s.heroImage ? [s.heroImage] : ['/images/hero.jpg'])
    const [activeSlide, setActiveSlide] = useState(0)

    useEffect(() => {
        if (slideImages.length <= 1) return
        const interval = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % slideImages.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [slideImages.length])

    return (
        <>
            <section className="hero">
                {slideImages.map((src, idx) => (
                    <div key={idx} className={`hero-slide ${idx === activeSlide ? 'active' : ''}`}>
                        <img src={src} alt={`Slide ${idx + 1}`} />
                    </div>
                ))}
                <div className="hero-overlay" />
                <div className="container hero-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 40, paddingTop: 120 }}>
                    <div style={{ textAlign: 'center', width: '100%' }}>
                        <p className="eyebrow light">{s.heroEyebrow || 'Flamingo Rover Scouts'}</p>
                        <h1 style={{ maxWidth: 800, margin: '0 auto', fontSize: 'clamp(28px, 5vw, 52px)' }}>{s.heroTitle || 'Scouting services simplified'}</h1>
                        <p style={{ color: 'rgba(255,255,255,0.85)', maxWidth: 600, margin: '12px auto 0', fontSize: 16 }}>{s.heroSubtitle || 'Educating young people to play a constructive role in society'}</p>
                        <div style={{ maxWidth: 680, margin: '24px auto 0', display: 'flex', gap: 0, background: 'rgba(255,255,255,0.95)', borderRadius: 999, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                            <input placeholder="Search for scout activities, events, resources..." style={{ flex: 1, border: 'none', outline: 'none', padding: '14px 20px', fontSize: 15, background: 'transparent', color: '#0f172a' }} />
                            <button style={{ background: '#62259D', color: 'white', border: 'none', padding: '14px 24px', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>Search</button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 18 }}>
                            <Link to="/register" className="btn" style={{ background: '#62259D', color: 'white', padding: '10px 24px' }}>Become a Member</Link>
                        </div>
                        {slideImages.length > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
                                {slideImages.map((_, idx) => (
                                    <button key={idx} onClick={() => setActiveSlide(idx)} style={{ width: idx === activeSlide ? 28 : 10, height: 10, borderRadius: 5, border: 'none', background: idx === activeSlide ? 'white' : 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.3s' }} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <div className="quick-access-row">
                <Link to="/shop" className="quick-access-item">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                    Shop Gear
                </Link>
                <Link to="/news" className="quick-access-item">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                    Latest News
                </Link>
                <Link to="/page/scout-movement" className="quick-access-item">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    Scout Movement
                </Link>
                <Link to="/page/scouting-education" className="quick-access-item">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 6 3 6 3s3 0 6-3v-5"/></svg>
                    Scouting Education
                </Link>
                <Link to="/page/events-camps" className="quick-access-item">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    Events & Camps
                </Link>
                <Link to="/letters" className="quick-access-item">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                    Letters
                </Link>
                <Link to="/photos" className="quick-access-item">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    Photo Gallery
                </Link>
            </div>


            {/* Strategic Pillars — Who We Are */}
            <section className="container section">
                <div className="page-head">
                    <p className="eyebrow">Who We Are</p>
                    <h2>Strategic Pillars</h2>
                    <p>Our guiding framework for building better citizens and stronger communities.</p>
                </div>
                <div className="card-grid four">
                    {[
                        { title: 'Scout Movement', text: 'Over 57 million Scouts worldwide learning by doing.', href: '/page/scout-movement', color: '#2E7D32' },
                        { title: 'Scouting Education', text: 'Non-formal education complementing school curricula.', href: '/page/scouting-education', color: '#1565C0' },
                        { title: 'Scout Promise & Law', text: 'The code of living that guides every Scout.', href: '/page/scout-promise-law', color: '#7B1FA2' },
                        { title: "Scouting's History", text: 'From 1907 Brownsea Island to a global movement.', href: '/page/scouting-history', color: '#E65100' },
                    ].map((w) => (
                        <Link key={w.title} to={w.href} className="card admin-card-link" style={{ borderLeft: `4px solid ${w.color}`, textDecoration: 'none' }}>
                            <div className="card-body">
                                <h3 style={{ color: w.color }}>{w.title}</h3>
                                <p>{w.text}</p>
                                <span style={{ color: w.color, fontWeight: 700, fontSize: 13 }}>Learn more →</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* What We Do */}
            <section className="container section">
                <div className="page-head">
                    <p className="eyebrow">What We Do</p>
                    <h2>Our Focus Areas</h2>
                    <p>Scouts contribute to communities through purposeful action.</p>
                </div>
                <div className="card-grid four">
                    {[
                        { title: 'Environment', text: 'Protecting nature through camps, cleanups and tree planting.', href: '/page/environment', color: '#16a34a' },
                        { title: 'Education', text: 'Learning by doing — the scout method builds capable leaders.', href: '/page/education', color: '#2563eb' },
                        { title: 'Peace', text: 'Dialogue, understanding and cross-cultural friendship.', href: '/page/peace', color: '#7c3aed' },
                        { title: 'Community Service', text: 'Service projects that make real impact in communities.', href: '/page/community-service', color: '#dc2626' },
                    ].map((w) => (
                        <Link key={w.title} to={w.href} className="card admin-card-link" style={{ borderLeft: `4px solid ${w.color}`, textDecoration: 'none' }}>
                            <div className="card-body">
                                <h3 style={{ color: w.color }}>{w.title}</h3>
                                <p>{w.text}</p>
                                <span style={{ color: w.color, fontWeight: 700, fontSize: 13 }}>Learn more →</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Get Involved */}
            <section className="container section">
                <div className="page-head">
                    <p className="eyebrow">Get Involved</p>
                    <h2>Join the Movement</h2>
                    <p>There are many ways to be part of world scouting.</p>
                </div>
                <div className="card-grid three">
                    {[
                        { title: 'Join Scouting', text: 'Start your scouting journey and register as a member.', href: '/register' },
                        { title: 'Events & Camps', text: 'Attend camps, jamborees, and community service events.', href: '/page/events-camps' },
                        { title: 'Downloads', text: 'Access official documents, forms and resources.', href: '/downloads' },
                        { title: 'Constitution', text: 'Read the scout constitution and governance documents.', href: '/constitution' },
                        { title: 'Photo Gallery', text: 'Browse photos from events, activities and camps.', href: '/photos' },
                        { title: 'Scouts for SDGs', text: 'Take action on the Sustainable Development Goals.', href: 'https://www.scout.org/what-we-do/global-action/scouts-sdgs' },
                    ].map((w) => (
                        w.href.startsWith('/') ? (
                            <Link key={w.title} to={w.href} className="card admin-card-link" style={{ textDecoration: 'none' }}>
                                <div className="card-body">
                                    <h3>{w.title}</h3>
                                    <p>{w.text}</p>
                                    <span className="admin-link-text">Explore →</span>
                                </div>
                            </Link>
                        ) : (
                            <a key={w.title} href={w.href} target="_blank" rel="noopener noreferrer" className="card admin-card-link">
                                <div className="card-body">
                                    <h3>{w.title}</h3>
                                    <p>{w.text}</p>
                                    <span className="admin-link-text">Explore →</span>
                                </div>
                            </a>
                        )
                    ))}
                </div>
            </section>

            {/* UN Sustainable Development Goals scroller */}
            <section className="container section">
                <div className="page-head">
                    <p className="eyebrow">Scouts for SDGs</p>
                    <h2>17 Sustainable Development Goals</h2>
                    <p>Scouting contributes to each of the UN's global goals for a better world.</p>
                </div>
                <div className="sdg-scroller">
                    {[
                        { n: 1, name: 'No Poverty', color: '#E5243B' },
                        { n: 2, name: 'Zero Hunger', color: '#DDA63A' },
                        { n: 3, name: 'Good Health', color: '#4C9F38' },
                        { n: 4, name: 'Quality Education', color: '#C5192D' },
                        { n: 5, name: 'Gender Equality', color: '#FF3A21' },
                        { n: 6, name: 'Clean Water', color: '#26BDE2' },
                        { n: 7, name: 'Clean Energy', color: '#FCC30B' },
                        { n: 8, name: 'Decent Work', color: '#A21942' },
                        { n: 9, name: 'Industry & Innovation', color: '#FD6925' },
                        { n: 10, name: 'Reduced Inequalities', color: '#DD1367' },
                        { n: 11, name: 'Sustainable Cities', color: '#FD9D24' },
                        { n: 12, name: 'Responsible Consumption', color: '#BF8B2E' },
                        { n: 13, name: 'Climate Action', color: '#3F7E44' },
                        { n: 14, name: 'Life Below Water', color: '#0A97D9' },
                        { n: 15, name: 'Life on Land', color: '#56C02B' },
                        { n: 16, name: 'Peace & Justice', color: '#00689D' },
                        { n: 17, name: 'Partnerships', color: '#19486A' },
                    ].map((sdg) => (
                        <a key={sdg.n} href={`https://sdgs.un.org/goals/goal${sdg.n}`} target="_blank" rel="noopener noreferrer" className="sdg-card" style={{ background: sdg.color }}>
                            <div className="sdg-number">{sdg.n}</div>
                            <div className="sdg-name">{sdg.name}</div>
                        </a>
                    ))}
                </div>
            </section>

            <section className="container section">
                <div className="cta-box">
                    <div>
                        <p className="eyebrow">{s.ctaEyebrow || 'Admin Control'}</p>
                        <h2>{s.ctaTitle || 'Separate admin side for managing the full website'}</h2>
                        <p>{s.ctaText || 'Admins and leaders will use a separate dashboard for shop products, images, prices, letters, news, gallery uploads, and meeting notices.'}</p>
                    </div>
                    <Link to="/login" className="btn btn-dark btn-lg">
                        Go to Login
                    </Link>
                </div>
            </section>
        </>
    )
}

const pageContent = {
    'scout-movement': {
        title: 'Scout Movement',
        eyebrow: 'Who We Are',
        body: `There are more than 57 million Scouts, young people and adults, male and female, in over 170 countries and territories worldwide. The Scout Movement was founded in 1907 by Robert Baden-Powell. Born out of the idea that young people should learn by doing, Scouting has grown into one of the largest youth movements in the world.\n\nScouting's purpose is to contribute to the development of young people in achieving their full physical, intellectual, emotional, social and spiritual potentials as individuals, as responsible citizens, and as members of their local, national and international communities.`,
    },
    'scouting-education': {
        title: 'Scouting Education',
        eyebrow: 'Who We Are',
        body: `Scouting provides non-formal education which complements the core curriculum offered in schools and colleges. It offers a comprehensive programme of activities, including community service, outdoor adventures, skills training, and leadership development.\n\nThe educational approach in Scouting follows the principle of "learning by doing" – young people gain practical experience through hands-on activities, teamwork, and real-world problem solving. This approach helps develop well-rounded individuals who are prepared to contribute positively to society.`,
    },
    'scout-method': {
        title: 'Scout Method',
        eyebrow: 'Who We Are',
        body: `The Scout Method is a system of progressive self-education through:\n\n• A Promise and Law – a code of living that guides behaviour\n• Learning by Doing – practical experience over theory\n• A system of teams (patrol system) – small groups to develop leadership\n• Symbolic Framework – a unifying theme of adventure and exploration\n• Personal Progression – challenges that develop individual growth\n• Nature – outdoor life and environmental stewardship\n• Adult Support – guidance from trained leaders and mentors\n• Community Involvement – service to others and society`,
    },
    'scout-promise-law': {
        title: 'Scout Promise & Law',
        eyebrow: 'Who We Are',
        body: `The Scout Promise:\n"On my honour I promise that I will do my best, to do my duty to God and my Country, to help other people at all times, and to obey the Scout Law."\n\nThe Scout Law:\n1. A Scout's honour is to be trusted\n2. A Scout is loyal\n3. A Scout's duty is to be useful and to help others\n4. A Scout is a friend to all\n5. A Scout is courteous\n6. A Scout is a friend to animals\n7. A Scout obeys orders\n8. A Scout smiles and whistles under all difficulties\n9. A Scout is thrifty\n10. A Scout is clean in thought, word and deed`,
    },
    'scouting-history': {
        title: "Scouting's History",
        eyebrow: 'Who We Are',
        body: `The birth of the Scout Movement in Kenya came shortly after it started in the United Kingdom. The first Nairobi troop was formed at St. John's Church (C.M.S.) Pumwani on November 24, 1910. In 1925 the first Eldoret troop was registered. The first Kijabe (Kenton College) troop was registered in 1926.\n\nGlobally, Scouting began in 1907 when Robert Baden-Powell held the first experimental camp on Brownsea Island, England. The movement grew rapidly, and by 1920, the first World Scout Jamboree took place in London with 8,000 Scouts from 34 countries. Today, Scouting is one of the world's premier youth movements with presence in virtually every country.`,
    },
    'about-us': {
        title: 'About Flamingo Rover Scouts',
        eyebrow: 'Who We Are',
        body: `Flamingo Rover Scouts is a vibrant scouting crew dedicated to building character, developing leadership, and serving communities through the scouting method.\n\nOur Vision: To be a leading rover crew developing well-rounded citizens who are agents of change.\n\nOur Mission: To contribute to the education of young people through a value system based on the Scout Promise and Law, helping build a better world where people are self-fulfilled as individuals and play a constructive role in society.\n\nWe are committed to providing care and protection to all youth involved in activities and safeguarding them from any form of discrimination.`,
    },
    'environment': {
        title: 'Environment',
        eyebrow: 'What We Do',
        body: `Scouts are natural environmental stewards. Through outdoor activities, conservation projects, and awareness campaigns, we help protect our planet for future generations.\n\nKey Activities:\n• Tree planting and reforestation initiatives\n• River and beach cleanups\n• Wildlife conservation awareness\n• Sustainable camping practices\n• Climate change education through Scouts for SDGs\n• Environmental badge programmes\n\nScouts worldwide have planted millions of trees and cleaned thousands of kilometres of waterways, demonstrating that young people can make a real difference.`,
    },
    'education': {
        title: 'Education',
        eyebrow: 'What We Do',
        body: `Scouting uses the principle of "learning by doing" – young people gain practical skills, knowledge, and attitudes through hands-on activities rather than passive instruction.\n\nOur Educational Focus:\n• Life skills training (first aid, cooking, navigation)\n• Leadership development through the patrol system\n• STEM activities and innovation challenges\n• Cultural exchange and language learning\n• Financial literacy and entrepreneurship\n• Digital skills and media literacy\n\nScouting education complements formal schooling and prepares young people for the challenges of modern life.`,
    },
    'peace': {
        title: 'Peace',
        eyebrow: 'What We Do',
        body: `Since its founding, Scouting has been a movement for peace. Through cross-cultural dialogue, community service, and character development, Scouts build bridges between communities and nations.\n\nPeace Initiatives:\n• Messengers of Peace programme – millions of service projects worldwide\n• Interfaith dialogue and understanding programmes\n• Conflict resolution and mediation training\n• Cross-border jamborees and cultural exchanges\n• Youth advocacy at international forums\n\nThe World Organization of the Scout Movement was nominated for the Nobel Peace Prize in 2021 for its commitment to peace education.`,
    },
    'community-service': {
        title: 'Community Service',
        eyebrow: 'What We Do',
        body: `Community service is at the heart of Scouting. The Scout Promise requires every Scout to "help other people at all times," and service projects are a core part of the programme.\n\nService Areas:\n• Health campaigns (blood drives, sanitation awareness)\n• Disaster relief and emergency preparedness\n• Food drives and feeding programmes\n• Mentorship and tutoring for younger students\n• Infrastructure improvement (building, painting, repairs)\n• Support for elderly and vulnerable populations\n\nFlamingo Rover Scouts regularly organises cleanups, community outreach, and humanitarian projects.`,
    },
    'events-camps': {
        title: 'Events & Camps',
        eyebrow: 'What We Do',
        body: `Camps, jamborees, and events are where Scouting truly comes alive. These gatherings bring Scouts together for adventure, learning, and fellowship.\n\nKey Events:\n• Annual Camping Weekends – outdoor skills and team building\n• Community Service Days – monthly outreach projects\n• Rover Moots – regional and national gatherings for rover scouts\n• World Scout Jamboree – the largest international scout event\n• JOTA-JOTI – Jamboree on the Air / Internet connecting Scouts worldwide\n• Investiture Ceremonies – welcoming new members\n• Leadership Training Camps – developing the next generation of leaders\n\nCheck our News section for upcoming events and registration details.`,
    },
}

function ContentPage() {
    const { slug } = useParams()
    const [page, setPage] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [form, setForm] = useState({ title: '', eyebrow: '', body: '' })
    const [saving, setSaving] = useState(false)
    
    // Keep a static fallback available just in case database hasn't been seeded yet 
    // or we are just bootstrapping an empty database.
    const fallback = pageContent[slug]
    
    const isStrictAdmin = getStoredUser()?.role === 'admin' || getStoredUser()?.role === 'superadmin'
    const token = localStorage.getItem('flamingo_token')

    const loadPage = useCallback(async () => {
        setLoading(true)
        try {
            const r = await fetch(`${API_URL}/api/pages/${slug}`)
            if (r.ok) {
                const data = await r.json()
                setPage({ ...fallback, ...data }) // Merging ensures we have standard structure
                setForm({ title: data.title, eyebrow: data.eyebrow || '', body: data.body })
            } else {
                setPage(fallback)
                if (fallback) setForm({ title: fallback.title, eyebrow: fallback.eyebrow || '', body: fallback.body })
            }
        } catch (err) {
            setPage(fallback)
            if (fallback) setForm({ title: fallback.title, eyebrow: fallback.eyebrow || '', body: fallback.body })
        } finally {
            setLoading(false)
        }
    }, [slug, fallback])

    useEffect(() => { loadPage() }, [loadPage])

    async function handleSave(e) {
        e.preventDefault()
        setSaving(true)
        try {
            const r = await fetch(`${API_URL}/api/pages/${slug}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(form)
            })
            if (!r.ok) throw new Error('Failed to save')
            setIsEditing(false)
            loadPage()
        } catch (err) {
            console.error(err)
            alert('Failed to save page content. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <section className="container page-section"><div className="panel">Loading content...</div></section>
    }

    if (!page) {
        return (
            <section className="container page-section">
                <div className="page-head"><h1>Page not found</h1><p>The page you are looking for does not exist.</p></div>
            </section>
        )
    }

    return (
        <section className="container page-section">
            {!isEditing ? (
                <>
                    <div className="page-head left" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                        <div>
                            <p className="eyebrow">{page.eyebrow}</p>
                            <h1 style={{ marginTop: 0 }}>{page.title}</h1>
                        </div>
                        {isStrictAdmin && (
                            <button className="btn btn-dark" onClick={() => setIsEditing(true)}>Edit Page Content</button>
                        )}
                    </div>
                    <div className="panel panel-lg" style={{ whiteSpace: 'pre-line', lineHeight: 1.8, fontSize: 15, color: '#334155' }}>
                        {page.body}
                    </div>
                </>
            ) : (
                <div className="panel panel-lg">
                    <h2 style={{ marginTop: 0, color: '#2E7D32' }}>Edit Page: {slug}</h2>
                    <form onSubmit={handleSave} style={{ display: 'grid', gap: 20 }}>
                        <div style={{ display: 'grid', gap: 8 }}>
                            <label style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>Eyebrow Text (Small text above title)</label>
                            <input 
                                value={form.eyebrow}
                                onChange={e => setForm({...form, eyebrow: e.target.value})}
                                style={{ padding: '12px 14px', borderRadius: 8, border: '1px solid #cbd5e1' }}
                            />
                        </div>
                        <div style={{ display: 'grid', gap: 8 }}>
                            <label style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>Main Title</label>
                            <input 
                                value={form.title}
                                onChange={e => setForm({...form, title: e.target.value})}
                                style={{ padding: '12px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 16, fontWeight: 600 }}
                            />
                        </div>
                        <div style={{ display: 'grid', gap: 8 }}>
                            <label style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>Body Content</label>
                            <textarea 
                                value={form.body}
                                onChange={e => setForm({...form, body: e.target.value})}
                                rows={14}
                                style={{ padding: '12px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontFamily: 'inherit', fontSize: 15, lineHeight: 1.6 }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button type="submit" className="btn btn-green" disabled={saving}>
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button type="button" className="btn btn-light" onClick={() => setIsEditing(false)} disabled={saving}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </section>
    )
}

function ShopPage() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function loadProducts() {
            try {
                setLoading(true)
                setError('')

                const response = await fetch(`${API_URL}/api/products/public`)
                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to load products')
                }

                setProducts(Array.isArray(data) ? data : [])
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        loadProducts()
    }, [])

    return (
        <section className="container page-section">
            <div className="page-head">
                <p className="eyebrow">Public Shop</p>
                <h1>Scout shop</h1>
                <p>Real products now come from the backend database.</p>
            </div>

            {loading ? (
                <div className="panel">Loading shop...</div>
            ) : error ? (
                <div className="panel">{error}</div>
            ) : products.length === 0 ? (
                <div className="panel">No products yet. Add some from the admin side.</div>
            ) : (
                <div className="card-grid three">
                    {products.map((item) => (
                        <article key={item.id} className="card product-card">
                            <img
                                src={item.imageUrl || '/images/scarf.jpg'}
                                alt={item.name}
                            />
                            <div className="card-body">
                                <p className="meta">{item.category}</p>
                                <h3>{item.name}</h3>
                                <p>{item.description}</p>
                                <div className="price-row">
                                    <strong>KSh {item.price}</strong>
                                    <a 
                                        href={`https://wa.me/254700000000?text=${encodeURIComponent(`Hi, I am interested in ordering the ${item.name} for KSh ${item.price}`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mini-btn"
                                        style={{ textAlign: 'center' }}
                                    >
                                        Order via WhatsApp
                                    </a>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    )
}

function NewsPage() {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://platform.twitter.com/widgets.js';
        script.async = true;
        document.body.appendChild(script);
        
        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <section className="container page-section">
            <div className="page-head">
                <p className="eyebrow">Public News</p>
                <h1>Latest specific social media posts</h1>
                <p>Stay updated with the latest news directly from our social channels.</p>
            </div>

            <div className="panel" style={{ background: 'transparent', boxShadow: 'none', border: 'none', padding: 0 }}>
                <a 
                    className="twitter-timeline" 
                    data-height="800"
                    data-theme="light"
                    href="https://twitter.com/worldscouting?ref_src=twsrc%5Etfw"
                >
                    Tweets by worldscouting
                </a>
            </div>
        </section>
    )
}

function LettersPage() {
    return (
        <section className="container page-section">
            <div className="page-head">
                <p className="eyebrow">Public Letters</p>
                <h1>Letters and newsletters</h1>
                <p>Official communication stays public here.</p>
            </div>

            <div className="card-grid three">
                {letterItems.map((item) => (
                    <article key={item.id} className="card photo-card">
                        <img src={item.image || '/images/photo1.jpg'} alt={item.title} style={{ height: 180 }} />
                        <div className="card-body">
                            <p className="meta">{item.date}</p>
                            <h3>{item.title}</h3>
                            <p>{item.text}</p>
                            <button className="mini-btn">Open</button>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    )
}

function PhotosPage() {
    const [photos, setPhotos] = useState([])
    const [loading, setLoading] = useState(true)
    const [viewPhoto, setViewPhoto] = useState(null)

    useEffect(() => {
        fetch(`${API_URL}/api/photos`)
            .then((r) => r.json())
            .then((data) => { if (Array.isArray(data)) setPhotos(data); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    const displayPhotos = photos.length > 0 ? photos : photoItems.map((p) => ({ ...p, url: p.image, title: p.title }))

    return (
        <section className="container page-section">
            <div className="page-head">
                <p className="eyebrow">Public Photos</p>
                <h1>Gallery</h1>
                <p>Public photo gallery for events, camps, and activities. Click any photo to view full size.</p>
            </div>

            {loading ? <div className="panel">Loading photos...</div> : (
                <div className="card-grid four">
                    {displayPhotos.map((item) => (
                        <article key={item.id} className="card photo-card">
                            <img
                                src={item.url || item.image}
                                alt={item.title}
                                style={{ cursor: 'zoom-in' }}
                                onClick={() => setViewPhoto(item)}
                            />
                            <div className="card-body">
                                <h3>{item.title}</h3>
                                {item.uploader && <p className="meta" style={{ fontSize: 12 }}>By {item.uploader.fullName}</p>}
                                <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                                    <button className="mini-btn" onClick={() => setViewPhoto(item)}>View</button>
                                    {item.downloadUrl && (
                                        <a href={item.downloadUrl} className="mini-btn" style={{ textDecoration: 'none' }}>Download</a>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {viewPhoto && (
                <div className="lightbox-overlay" onClick={() => setViewPhoto(null)}>
                    <div onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}>
                        <img src={viewPhoto.url || viewPhoto.image} alt={viewPhoto.title} />
                        <div style={{ marginTop: 14, display: 'flex', gap: 10, justifyContent: 'center' }}>
                            <span style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>{viewPhoto.title}</span>
                            {viewPhoto.downloadUrl && (
                                <a href={viewPhoto.downloadUrl} style={{ color: '#a78bfa', fontWeight: 600, textDecoration: 'none' }}>⬇ Download</a>
                            )}
                        </div>
                        <button onClick={() => setViewPhoto(null)} style={{ marginTop: 10, background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', padding: '6px 20px', borderRadius: 6, cursor: 'pointer', fontSize: 14 }}>Close</button>
                    </div>
                </div>
            )}
        </section>
    )
}


function DocumentList({ category, title, description }) {
    const [docs, setDocs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`${API_URL}/api/documents/${category}`)
            .then(r => r.json())
            .then(data => {
                setDocs(Array.isArray(data) ? data : [])
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [category])

    const isAdmin = getStoredUser()?.role === 'admin' || getStoredUser()?.role === 'leader' || getStoredUser()?.role === 'superadmin';

    return (
        <section className="container section">
            <div className="page-head left" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <p className="eyebrow">Resources</p>
                    <h1 style={{ marginTop: 0 }}>{title}</h1>
                    <p>{description}</p>
                </div>
                {isAdmin && (
                    <Link to={`/admin/${category}`} className="btn btn-dark" style={{ whiteSpace: 'nowrap' }}>
                        Admin: Upload Document(s)
                    </Link>
                )}
            </div>

            {loading ? (
                <div className="panel">Loading documents...</div>
            ) : docs.length === 0 ? (
                <div className="panel" style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>No documents available in this category.</div>
            ) : (
                <div style={{ display: 'grid', gap: 12 }}>
                    {docs.map(doc => (
                        <div key={doc.id} className="panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', background: 'white', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div style={{ width: 40, height: 40, borderRadius: 8, background: '#f0f4f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2E7D32' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <h3 style={{ margin: 0, fontSize: 16 }}>{doc.title}</h3>
                                    <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
                                        {doc.originalName} • {(doc.size / 1024).toFixed(1)} KB • {new Date(doc.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                {doc.url && (
                                    <a href={doc.url} target="_blank" rel="noreferrer" className="btn btn-light" style={{ padding: '8px 20px', fontSize: 13, textDecoration: 'none' }}>
                                        View
                                    </a>
                                )}
                                <a href={doc.downloadUrl || doc.url} download={doc.originalName} className="btn btn-green" style={{ padding: '8px 20px', fontSize: 13, textDecoration: 'none' }}>
                                    Download
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}

function DownloadsPage() {
    return (
        <DocumentList 
            category="downloads" 
            title="Downloads" 
            description="Access official Flamingo Rover Scouts documents, forms, and resources."
        />
    )
}

function ConstitutionPage() {
    return (
        <DocumentList 
            category="constitution" 
            title="Constitution & Governance" 
            description="Official documents regarding the governance and constitution of Flamingo Rover Scouts."
        />
    )
}

function LoginPage({ onLogin }) {
    const navigate = useNavigate()
    // Generate a simple math challenge once per render
    const [challenge] = useState(() => {
        const a = Math.floor(Math.random() * 9) + 1
        const b = Math.floor(Math.random() * 9) + 1
        return { a, b, answer: String(a + b) }
    })
    const [form, setForm] = useState({ email: '', password: '', botAnswer: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    function handleChange(e) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (form.botAnswer !== challenge.answer) {
            setError(`Bot check failed. ${challenge.a} + ${challenge.b} = ?`)
            return
        }
        setLoading(true)
        setError('')

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: form.email, password: form.password, botAnswer: form.botAnswer }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Login failed')
            }

            onLogin(data)

            const { role } = data.user
            if (role === 'superadmin' || role === 'admin' || role === 'leader') {
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
        <section className="auth-wrap">
            <div className="auth-card">
                <p className="eyebrow">Login</p>
                <h1>Sign in</h1>
                <p>Members and admins both sign in here.</p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    <div style={{ background: '#f1f5f9', borderRadius: 8, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 14, color: '#475569', flexShrink: 0 }}>🤖 Prove you're human: <strong>{challenge.a} + {challenge.b} = ?</strong></span>
                        <input
                            name="botAnswer"
                            type="number"
                            placeholder="Answer"
                            value={form.botAnswer}
                            onChange={handleChange}
                            required
                            style={{ width: 80, padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 14 }}
                        />
                    </div>

                    {error ? <div className="error-box">{error}</div> : null}

                    <button type="submit" className="btn btn-dark btn-full" disabled={loading}>
                        {loading ? 'Signing in...' : 'Login'}
                    </button>
                </form>

                <p className="auth-linkline">
                    No account yet? <Link to="/register">Register here</Link>
                </p>
            </div>
        </section>
    )
}

function RegisterPage() {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    function handleChange(e) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed')
            }

            setSuccess('Account created. You can now log in.')
            setTimeout(() => navigate('/login'), 1000)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="auth-wrap">
            <div className="auth-card">
                <p className="eyebrow">Register</p>
                <h1>Create account</h1>
                <p>Normal registration is now on its own page, not mixed into the homepage header.</p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <input
                        name="fullName"
                        placeholder="Full name"
                        value={form.fullName}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="phone"
                        placeholder="Phone number"
                        value={form.phone}
                        onChange={handleChange}
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    {error ? <div className="error-box">{error}</div> : null}
                    {success ? <div className="success-box">{success}</div> : null}

                    <button type="submit" className="btn btn-green btn-full" disabled={loading}>
                        {loading ? 'Creating...' : 'Create account'}
                    </button>
                </form>

                <p className="auth-linkline">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </div>
        </section>
    )
}

function AdminLayout({ user, onLogout }) {
    return (
        <div className="admin-shell">
            <aside className="admin-sidebar">
                <div className="admin-brand">
                    <div className="brand-mark">F</div>
                    <div>
                        <div className="brand-title">Flamingo Admin</div>
                        <div className="brand-subtitle">Manage the website</div>
                    </div>
                </div>

                <div className="admin-userbox">
                    <strong>{user?.fullName}</strong>
                    <span>{user?.role}</span>
                </div>

                <nav className="admin-nav">
                    <NavLink to="/admin/dashboard" className={({ isActive }) => adminNavClass(isActive)}>
                        Dashboard
                    </NavLink>
                    <NavLink to="/admin/shop" className={({ isActive }) => adminNavClass(isActive)}>
                        Shop Manager
                    </NavLink>
                    <NavLink to="/admin/news" className={({ isActive }) => adminNavClass(isActive)}>
                        News Manager
                    </NavLink>
                    <NavLink to="/admin/letters" className={({ isActive }) => adminNavClass(isActive)}>
                        Letters Manager
                    </NavLink>
                    <NavLink to="/admin/photos" className={({ isActive }) => adminNavClass(isActive)}>
                        Gallery Manager
                    </NavLink>
                    <NavLink to="/admin/notices" className={({ isActive }) => adminNavClass(isActive)}>
                        Meeting Notices
                    </NavLink>
                    <NavLink to="/admin/homepage-editor" className={({ isActive }) => adminNavClass(isActive)}>
                        Homepage Editor
                    </NavLink>
                    <NavLink to="/admin/downloads" className={({ isActive }) => adminNavClass(isActive)}>
                        Downloads Manager
                    </NavLink>
                    <NavLink to="/admin/constitution" className={({ isActive }) => adminNavClass(isActive)}>
                        Constitution Manager
                    </NavLink>
                    <NavLink to="/admin/audit-logs" className={({ isActive }) => adminNavClass(isActive)}>
                        Audit Logs
                    </NavLink>
                    {user?.role === 'superadmin' && (
                        <NavLink to="/admin/users" className={({ isActive }) => adminNavClass(isActive) + ' superadmin-link'}>
                            Manage Users
                        </NavLink>
                    )}
                </nav>

                <div className="admin-actions">
                    <Link to="/" className="btn btn-light btn-full">
                        Public Website
                    </Link>
                    <button className="btn btn-dark btn-full" onClick={onLogout}>
                        Logout
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    )
}

function AdminDashboard({ isSuperAdmin, user, token }) {
    const [stats, setStats] = useState(null)

    useEffect(() => {
        fetch(`${API_URL}/api/stats`, { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => r.json())
            .then((data) => setStats(data))
            .catch(() => {})
    }, [token])

    const statItems = stats ? [
        { label: 'Total Users', value: stats.totalUsers, color: '#2E7D32' },
        { label: 'Admins', value: stats.admins, color: '#1B5E20' },
        { label: 'Members', value: stats.members, color: '#388E3C' },
        { label: 'Active', value: stats.approved, color: '#FFB300' },
        { label: 'Pending', value: stats.pending, color: '#E65100' },
    ] : []

    return (
        <section>
            <div className="page-head left">
                <p className="eyebrow">Admin Panel</p>
                <h1>Dashboard</h1>
                <p>Welcome back, {user?.fullName}. Here is your system overview.</p>
            </div>

            {stats && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 28 }}>
                    {statItems.map((s) => (
                        <div key={s.label} style={{ background: 'white', borderRadius: 12, padding: '20px 18px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderLeft: `4px solid ${s.color}` }}>
                            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600, marginTop: 4 }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            )}

            {isSuperAdmin && (
                <div style={{ background: 'linear-gradient(135deg, #1B5E20, #4CAF50)', borderRadius: 12, padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ color: 'white' }}>
                        <strong style={{ display: 'block', fontSize: 15 }}>Super Admin Mode</strong>
                        <span style={{ fontSize: 13, opacity: 0.85 }}>Full access — approve users, assign roles, manage everything.</span>
                    </div>
                    <Link to="/admin/users" className="btn" style={{ marginLeft: 'auto', background: 'white', color: '#1B5E20', fontWeight: 600 }}>Manage Users</Link>
                </div>
            )}

            {stats && stats.recentLogs && stats.recentLogs.length > 0 && (
                <div className="panel panel-lg">
                    <h2 style={{ marginBottom: 14 }}>Recent Activity</h2>
                    <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                        {stats.recentLogs.map((log) => (
                            <div key={log.id} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontSize: 13 }}>
                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2E7D32', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                                    {log.user?.fullName?.charAt(0) || '?'}
                                </div>
                                <div>
                                    <div><strong>{log.user?.fullName}</strong> · <span style={{ color: '#64748b' }}>{log.action}</span></div>
                                    <div style={{ color: '#94a3b8', fontSize: 11 }}>{new Date(log.createdAt).toLocaleString()}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    )
}

function AdminShopPage() {
    const token = localStorage.getItem('flamingo_token') || ''

    const emptyForm = {
        name: '',
        category: 'Scarfs',
        price: '',
        stock: '1',
        description: '',
        isActive: true,
        image: null,
    }

    const [form, setForm] = useState(emptyForm)
    const [products, setProducts] = useState([])
    const [editingId, setEditingId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    async function loadProducts() {
        try {
            setLoading(true)
            setError('')

            const response = await fetch(`${API_URL}/api/products/admin`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Failed to load admin products')
            }

            setProducts(Array.isArray(data) ? data : [])
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadProducts()
    }, [])

    function handleChange(e) {
        const { name, value, type, checked, files } = e.target

        if (type === 'checkbox') {
            setForm((prev) => ({ ...prev, [name]: checked }))
            return
        }

        if (type === 'file') {
            setForm((prev) => ({ ...prev, image: files?.[0] || null }))
            return
        }

        setForm((prev) => ({ ...prev, [name]: value }))
    }

    function startEdit(product) {
        setEditingId(product.id)
        setMessage('')
        setError('')

        setForm({
            name: product.name || '',
            category: product.category || 'Scarfs',
            price: String(product.price ?? ''),
            stock: String(product.stock ?? 0),
            description: product.description || '',
            isActive: !!product.isActive,
            image: null,
        })

        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    function resetForm() {
        setEditingId(null)
        setForm(emptyForm)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setSaving(true)
        setMessage('')
        setError('')

        try {
            const body = new FormData()
            body.append('name', form.name)
            body.append('category', form.category)
            body.append('price', form.price)
            body.append('stock', form.stock)
            body.append('description', form.description)
            body.append('isActive', String(form.isActive))

            if (form.image) {
                body.append('image', form.image)
            }

            const url = editingId
                ? `${API_URL}/api/products/${editingId}`
                : `${API_URL}/api/products`

            const method = editingId ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body,
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Save failed')
            }

            setMessage(editingId ? 'Product updated.' : 'Product created.')
            resetForm()
            loadProducts()
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    async function handleDelete(id) {
        const ok = window.confirm('Delete this product?')
        if (!ok) return

        try {
            setMessage('')
            setError('')

            const response = await fetch(`${API_URL}/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Delete failed')
            }

            setMessage('Product deleted.')
            if (editingId === id) resetForm()
            loadProducts()
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <section>
            <div className="page-head left compact">
                <p className="eyebrow">Admin Manager</p>
                <h1>Shop Manager</h1>
                <p>Add products, upload images, edit prices, stock, and public visibility.</p>
            </div>

            <div className="admin-shop-grid">
                <div className="panel panel-lg">
                    <h2>{editingId ? 'Edit product' : 'Add product'}</h2>

                    <form className="admin-form-grid" onSubmit={handleSubmit}>
                        <div className="admin-field">
                            <label>Product name</label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Flamingo Scout Scarf"
                                required
                            />
                        </div>

                        <div className="admin-field">
                            <label>Category</label>
                            <input
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                placeholder="Scarfs"
                                required
                            />
                        </div>

                        <div className="admin-field">
                            <label>Price</label>
                            <input
                                name="price"
                                type="number"
                                value={form.price}
                                onChange={handleChange}
                                placeholder="850"
                                required
                            />
                        </div>

                        <div className="admin-field">
                            <label>Stock</label>
                            <input
                                name="stock"
                                type="number"
                                value={form.stock}
                                onChange={handleChange}
                                placeholder="10"
                                required
                            />
                        </div>

                        <div className="admin-field">
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Describe the product"
                                required
                            />
                        </div>

                        <div className="admin-field">
                            <label>Product image</label>
                            {editingId && (() => {
                                const current = products.find(p => p.id === editingId)
                                return current && current.imageUrl ? (
                                    <div style={{ marginBottom: 8 }}>
                                        <img src={current.imageUrl} alt="Current" style={{ width: 100, height: 70, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0' }} />
                                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Current image — upload below to replace</div>
                                    </div>
                                ) : null
                            })()}
                            <input
                                name="image"
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="admin-field admin-check-row">
                            <label className="checkbox-line">
                                <input
                                    name="isActive"
                                    type="checkbox"
                                    checked={form.isActive}
                                    onChange={handleChange}
                                />
                                <span>Visible on public shop</span>
                            </label>
                        </div>

                        {error ? <div className="error-box">{error}</div> : null}
                        {message ? <div className="success-box">{message}</div> : null}

                        <div className="admin-toolbar">
                            <button type="submit" className="btn btn-green">
                                {saving ? 'Saving...' : editingId ? 'Update product' : 'Create product'}
                            </button>

                            {editingId ? (
                                <button type="button" className="btn btn-light" onClick={resetForm}>
                                    Cancel edit
                                </button>
                            ) : null}
                        </div>
                    </form>
                </div>

                <div className="panel panel-lg">
                    <h2>Existing products</h2>

                    {loading ? (
                        <p>Loading products...</p>
                    ) : products.length === 0 ? (
                        <p>No products yet.</p>
                    ) : (
                        <div className="admin-products-list">
                            {products.map((item) => (
                                <article key={item.id} className="admin-product-item">
                                    <img
                                        src={item.imageUrl || '/images/scarf.jpg'}
                                        alt={item.name}
                                    />

                                    <div className="admin-product-copy">
                                        <div className="admin-product-top">
                                            <h3>{item.name}</h3>
                                            <span className={`status-pill ${item.isActive ? 'on' : 'off'}`}>
                                                {item.isActive ? 'Public' : 'Hidden'}
                                            </span>
                                        </div>

                                        <p className="meta">{item.category}</p>
                                        <p>{item.description}</p>

                                        <div className="price-row admin-price-row">
                                            <strong>KSh {item.price}</strong>
                                            <span>Stock: {item.stock}</span>
                                        </div>

                                        <div className="admin-toolbar">
                                            <button type="button" className="btn btn-light" onClick={() => startEdit(item)}>
                                                Edit
                                            </button>
                                            <button type="button" className="btn btn-dark" onClick={() => handleDelete(item.id)}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

function AdminNewsPage() {
    return (
        <AdminPanel
            title="News Manager"
            subtitle="This is where admins will write news posts, edit updates, and publish public announcements."
            fields={[
                'News title',
                'Category',
                'News content',
                'Upload cover image',
            ]}
        />
    )
}

function AdminLettersPage() {
    return (
        <AdminPanel
            title="Letters Manager"
            subtitle="This is where admins will upload letters, newsletters, downloadable notices, and official files."
            fields={[
                'Letter title',
                'Description',
                'Upload PDF or file',
            ]}
        />
    )
}

function AdminPhotosPage() {
    const token = localStorage.getItem('flamingo_token') || ''
    const [photos, setPhotos] = useState([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [msg, setMsg] = useState('')
    const [linkUrl, setLinkUrl] = useState('')
    const [linkTitle, setLinkTitle] = useState('')

    async function loadPhotos() {
        try {
            const res = await fetch(`${API_URL}/api/photos`)
            const data = await res.json()
            if (Array.isArray(data)) setPhotos(data)
        } catch {} finally { setLoading(false) }
    }

    useEffect(() => { loadPhotos() }, [])

    async function handleMultiUpload(e) {
        const files = Array.from(e.target.files)
        if (!files.length) return
        setUploading(true); setMsg('')
        let count = 0
        for (const file of files) {
            const fd = new FormData()
            fd.append('photo', file)
            fd.append('title', file.name.replace(/\.[^.]+$/, ''))
            try {
                const res = await fetch(`${API_URL}/api/photos/upload`, {
                    method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd
                })
                if (res.ok) count++
            } catch {}
        }
        setMsg(`${count} photo${count !== 1 ? 's' : ''} uploaded successfully!`)
        e.target.value = ''
        setUploading(false)
        loadPhotos()
    }

    async function handleLinkUpload(e) {
        e.preventDefault()
        if (!linkUrl) return
        setUploading(true); setMsg('')
        try {
            const res = await fetch(`${API_URL}/api/photos/upload-link`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ url: linkUrl, title: linkTitle || 'Linked Photo' }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message)
            setMsg('Link photo added!')
            setLinkUrl(''); setLinkTitle('')
            loadPhotos()
        } catch (err) { setMsg(err.message || 'Failed to add link') }
        finally { setUploading(false) }
    }

    async function handleDelete(id) {
        if (!window.confirm('Delete this photo?')) return
        await fetch(`${API_URL}/api/photos/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
        setMsg('Photo deleted.')
        loadPhotos()
    }

    return (
        <section>
            <div className="page-head left compact">
                <p className="eyebrow">Admin Manager</p>
                <h1>Gallery Manager</h1>
                <p>Upload multiple photos at once, add external image links, and manage the public gallery.</p>
            </div>

            {msg && <div className="success-box" style={{ marginBottom: 16 }}>{msg}</div>}

            <div className="admin-shop-grid">
                <div className="panel panel-lg">
                    <h2>Upload Photos</h2>
                    <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>Select multiple files at once. Supported: JPG, PNG, WEBP (max 5MB each).</p>
                    <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        multiple
                        onChange={handleMultiUpload}
                        disabled={uploading}
                        style={{ fontSize: 14, marginBottom: 20 }}
                    />
                    {uploading && <p style={{ color: '#62259D', fontWeight: 600 }}>Uploading...</p>}

                    <h3 style={{ marginTop: 20, marginBottom: 10, fontSize: 15 }}>Or paste an image link</h3>
                    <form onSubmit={handleLinkUpload} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <input value={linkTitle} onChange={(e) => setLinkTitle(e.target.value)} placeholder="Photo title" style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8 }} />
                        <input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://example.com/photo.jpg" style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8 }} />
                        <button type="submit" className="btn btn-green" disabled={uploading || !linkUrl} style={{ alignSelf: 'flex-start' }}>Add Link Photo</button>
                    </form>
                </div>

                <div className="panel panel-lg">
                    <h2>Existing Photos ({photos.length})</h2>
                    {loading ? <p>Loading...</p> : photos.length === 0 ? <p>No photos uploaded yet.</p> : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginTop: 10 }}>
                            {photos.map((p) => (
                                <div key={p.id} style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                    <img src={p.url} alt={p.title} style={{ width: '100%', height: 100, objectFit: 'cover', display: 'block' }} />
                                    <div style={{ padding: '6px 8px', fontSize: 11 }}>
                                        <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                                        <button onClick={() => handleDelete(p.id)} style={{ marginTop: 4, background: '#fee2e2', border: 'none', color: '#dc2626', padding: '2px 8px', borderRadius: 4, fontSize: 10, cursor: 'pointer' }}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

function AdminNoticesPage() {
    return (
        <AdminPanel
            title="Meeting Notices"
            subtitle="This is where admins will prepare crew and general meeting notices for members."
            fields={[
                'Notice title',
                'Meeting type',
                'Meeting date',
                'Message',
                'Send by email or phone',
            ]}
        />
    )
}

function AdminPanel({ title, subtitle, fields }) {
    return (
        <section className="panel panel-lg">
            <div className="page-head left compact">
                <p className="eyebrow">Admin Manager</p>
                <h1>{title}</h1>
                <p>{subtitle}</p>
            </div>

            <div className="admin-form-grid">
                {fields.map((field) => (
                    <div key={field} className="admin-field">
                        <label>{field}</label>
                        {field.toLowerCase().includes('message') ||
                            field.toLowerCase().includes('content') ||
                            field.toLowerCase().includes('description') ? (
                            <textarea placeholder={field} />
                        ) : (
                            <input placeholder={field} />
                        )}
                    </div>
                ))}
            </div>

            <div className="admin-toolbar">
                <button className="btn btn-dark">Save draft</button>
                <button className="btn btn-green">Publish / Upload</button>
            </div>
        </section>
    )
}

function navClass(isActive) {
    return `nav-link ${isActive ? 'active' : ''}`
}

function adminNavClass(isActive) {
    return `admin-nav-link ${isActive ? 'active' : ''}`
}

function AdminUsersPage({ token }) {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [msg, setMsg] = useState('')

    useEffect(() => {
        fetch(`${API_URL}/api/users`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((r) => r.json())
            .then((data) => { setUsers(Array.isArray(data) ? data : []); setLoading(false) })
            .catch(() => setLoading(false))
    }, [token])

    async function updateUser(id, role, status) {
        setMsg('')
        const res = await fetch(`${API_URL}/api/users/${id}/role`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ role, status }),
        })
        const data = await res.json()
        if (!res.ok) { setMsg(data.message || 'Failed'); return }
        setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role, status } : u)))
        setMsg('User updated successfully.')
    }

    const statusColor = { approved: '#16a34a', pending: '#d97706', rejected: '#dc2626' }
    const roleOptions = ['member', 'leader', 'admin']

    return (
        <section>
            <div className="page-head left">
                <p className="eyebrow">👑 Super Admin</p>
                <h1>Manage Users</h1>
                <p>Approve registrations and assign roles. Only the super admin sees this page.</p>
            </div>
            {msg && <div className="success-box" style={{ marginBottom: 16 }}>{msg}</div>}
            {loading ? <div className="panel">Loading users...</div> : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                <th style={{ padding: '10px 14px', textAlign: 'left' }}>Name</th>
                                <th style={{ padding: '10px 14px', textAlign: 'left' }}>Email</th>
                                <th style={{ padding: '10px 14px', textAlign: 'left' }}>Role</th>
                                <th style={{ padding: '10px 14px', textAlign: 'left' }}>Status</th>
                                <th style={{ padding: '10px 14px', textAlign: 'left' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '10px 14px' }}>{u.fullName}</td>
                                    <td style={{ padding: '10px 14px', color: '#64748b' }}>{u.email}</td>
                                    <td style={{ padding: '10px 14px' }}>
                                        {u.role === 'superadmin' ? (
                                            <span style={{ color: '#62259D', fontWeight: 700 }}>👑 superadmin</span>
                                        ) : (
                                            <select
                                                value={u.role}
                                                onChange={(e) => updateUser(u.id, e.target.value, u.status)}
                                                style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13 }}
                                            >
                                                {roleOptions.map((r) => <option key={r} value={r}>{r}</option>)}
                                            </select>
                                        )}
                                    </td>
                                    <td style={{ padding: '10px 14px' }}>
                                        <span style={{ color: statusColor[u.status] || '#475569', fontWeight: 600, fontSize: 13 }}>
                                            {u.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '10px 14px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        {u.role !== 'superadmin' && (
                                            <>
                                                {u.status !== 'approved' && (
                                                    <button
                                                        className="btn btn-green"
                                                        style={{ padding: '5px 12px', fontSize: 12 }}
                                                        onClick={() => updateUser(u.id, u.role, 'approved')}
                                                    >Approve</button>
                                                )}
                                                {u.status !== 'rejected' && (
                                                    <button
                                                        className="btn btn-dark"
                                                        style={{ padding: '5px 12px', fontSize: 12, background: '#ef4444' }}
                                                        onClick={() => updateUser(u.id, u.role, 'rejected')}
                                                    >Reject</button>
                                                )}
                                                {u.status !== 'pending' && (
                                                    <button
                                                        className="btn btn-light"
                                                        style={{ padding: '5px 12px', fontSize: 12 }}
                                                        onClick={() => updateUser(u.id, u.role, 'pending')}
                                                    >Set Pending</button>
                                                )}
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    )
}

function AdminAuditLogPage({ token }) {
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`${API_URL}/api/users/audit-logs`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((r) => r.json())
            .then((data) => { setLogs(Array.isArray(data) ? data : []); setLoading(false) })
            .catch(() => setLoading(false))
    }, [token])

    return (
        <section>
            <div className="page-head left">
                <p className="eyebrow">Audit Trail</p>
                <h1>Audit Logs</h1>
                <p>Full history of every edit made to the system — who did it and when.</p>
            </div>
            {loading ? <div className="panel">Loading logs...</div> : logs.length === 0 ? (
                <div className="panel">No activity logged yet.</div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                <th style={{ padding: '10px 14px', textAlign: 'left' }}>When</th>
                                <th style={{ padding: '10px 14px', textAlign: 'left' }}>Who</th>
                                <th style={{ padding: '10px 14px', textAlign: 'left' }}>Action</th>
                                <th style={{ padding: '10px 14px', textAlign: 'left' }}>Entity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '10px 14px', color: '#64748b', whiteSpace: 'nowrap' }}>
                                        {new Date(log.createdAt).toLocaleString()}
                                    </td>
                                    <td style={{ padding: '10px 14px' }}>
                                        <div style={{ fontWeight: 600 }}>{log.user?.fullName}</div>
                                        <div style={{ fontSize: 12, color: '#94a3b8' }}>{log.user?.email}</div>
                                    </td>
                                    <td style={{ padding: '10px 14px' }}>{log.action}</td>
                                    <td style={{ padding: '10px 14px' }}>
                                        <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>
                                            {log.entity}{log.entityId ? ` #${log.entityId}` : ''}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    )
}

function AdminHomepageEditor({ token }) {
    const [form, setForm] = useState({
        heroEyebrow: '', heroTitle: '', heroSubtitle: '',
        shopSectionEyebrow: '', shopSectionTitle: '',
        newsSectionEyebrow: '', newsSectionTitle: '',
        gallerySectionEyebrow: '', gallerySectionTitle: '',
        ctaEyebrow: '', ctaTitle: '', ctaText: '',
    })
    const [newsCards, setNewsCards] = useState([
        { id: 1, title: '', category: '', text: '' },
        { id: 2, title: '', category: '', text: '' },
        { id: 3, title: '', category: '', text: '' },
    ])
    const [letterCards, setLetterCards] = useState([
        { id: 1, title: '', date: '', text: '' },
        { id: 2, title: '', date: '', text: '' },
        { id: 3, title: '', date: '', text: '' },
    ])
    const [galleryCards, setGalleryCards] = useState([
        { id: 1, title: '' },
        { id: 2, title: '' },
        { id: 3, title: '' },
        { id: 4, title: '' },
    ])
    const [images, setImages] = useState({})
    const [heroSlides, setHeroSlides] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [msg, setMsg] = useState('')
    const [uploadMsg, setUploadMsg] = useState('')

    useEffect(() => {
        fetch(`${API_URL}/api/settings`, { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => r.json())
            .then((data) => {
                setForm({
                    heroEyebrow: data.heroEyebrow || '', heroTitle: data.heroTitle || '', heroSubtitle: data.heroSubtitle || '',
                    shopSectionEyebrow: data.shopSectionEyebrow || '', shopSectionTitle: data.shopSectionTitle || '',
                    newsSectionEyebrow: data.newsSectionEyebrow || '', newsSectionTitle: data.newsSectionTitle || '',
                    gallerySectionEyebrow: data.gallerySectionEyebrow || '', gallerySectionTitle: data.gallerySectionTitle || '',
                    ctaEyebrow: data.ctaEyebrow || '', ctaTitle: data.ctaTitle || '', ctaText: data.ctaText || '',
                })
                try { const n = JSON.parse(data.newsItems); if (Array.isArray(n) && n.length) setNewsCards(n) } catch {}
                try { const l = JSON.parse(data.letterItems); if (Array.isArray(l) && l.length) setLetterCards(l) } catch {}
                try { const g = JSON.parse(data.galleryItems); if (Array.isArray(g) && g.length) setGalleryCards(g) } catch {}
                try { const sl = JSON.parse(data.heroSlides); if (Array.isArray(sl)) setHeroSlides(sl) } catch {}
                const imgKeys = ['heroImage', 'siteLogo', 'newsImage1', 'newsImage2', 'newsImage3', 'galleryImage1', 'galleryImage2', 'galleryImage3', 'galleryImage4']
                const imgs = {}
                for (const k of imgKeys) { if (data[k]) imgs[k] = data[k] }
                setImages(imgs)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [token])

    function handleChange(e) { setForm((p) => ({ ...p, [e.target.name]: e.target.value })) }

    function updateCard(setter, idx, field, value) {
        setter((prev) => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c))
    }

    async function handleSave(e) {
        e.preventDefault()
        setSaving(true)
        setMsg('')
        try {
            const payload = {
                ...form,
                newsItems: JSON.stringify(newsCards),
                letterItems: JSON.stringify(letterCards),
                galleryItems: JSON.stringify(galleryCards),
                heroSlides: JSON.stringify(heroSlides),
            }
            const res = await fetch(`${API_URL}/api/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message)
            setMsg('All homepage content saved successfully!')
        } catch (err) {
            setMsg(err.message || 'Failed to save')
        } finally { setSaving(false) }
    }

    async function uploadImage(key, file) {
        setUploadMsg('')
        const fd = new FormData()
        fd.append('key', key)
        fd.append('image', file)
        try {
            const res = await fetch(`${API_URL}/api/settings/upload-image`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message)
            setImages((prev) => ({ ...prev, [key]: data.url }))
            setUploadMsg('Image uploaded successfully!')
        } catch (err) { setUploadMsg(err.message || 'Upload failed') }
    }

    const fs = { display: 'block', width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, marginTop: 6 }
    const ls = { display: 'block', marginBottom: 14, fontWeight: 600, fontSize: 13, color: '#334155' }
    const gs = { background: '#f8fafc', borderRadius: 12, padding: '20px 24px', marginBottom: 24 }
    const ts = { width: 120, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0' }
    const ir = { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }
    const cardBox = { background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '14px 16px', marginBottom: 12 }

    function Img({ label, settingKey }) {
        return (
            <div style={ir}>
                {images[settingKey] ? <img src={images[settingKey]} alt={label} style={ts} /> : <div style={{ ...ts, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', color: '#94a3b8', fontSize: 11 }}>No image</div>}
                <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>{label}</div>
                    <input type="file" accept="image/*" onChange={(e) => { if (e.target.files[0]) uploadImage(settingKey, e.target.files[0]) }} style={{ fontSize: 11 }} />
                </div>
            </div>
        )
    }

    if (loading) return <div className="panel">Loading settings...</div>

    return (
        <section>
            <div className="page-head left">
                <p className="eyebrow">Content Manager</p>
                <h1>Homepage Editor</h1>
                <p>Edit all the text, images, and card content visible on the public homepage.</p>
            </div>

            {uploadMsg && <div className="success-box" style={{ marginBottom: 16 }}>{uploadMsg}</div>}

            <form onSubmit={handleSave}>
                <div style={gs}>
                    <h3 style={{ marginBottom: 14, color: '#2E7D32' }}>Site Logo</h3>
                    <p style={{ fontSize: 13, color: '#64748b', marginBottom: 10 }}>Upload your Flamingo logo to replace the default "F" mark in the header.</p>
                    <Img label="Site Logo" settingKey="siteLogo" />
                </div>

                <div style={gs}>
                    <h3 style={{ marginBottom: 14, color: '#2E7D32' }}>Hero Banner</h3>
                    <Img label="Hero Default Background" settingKey="heroImage" />
                    <h4 style={{ marginTop: 10, marginBottom: 10, fontSize: 14, color: '#475569' }}>Hero Slideshow (multiple images)</h4>
                    <p style={{ fontSize: 13, color: '#64748b', marginBottom: 10 }}>Add multiple images for a rotating slideshow. If empty, the single hero background above is used.</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                        {heroSlides.map((url, idx) => (
                            <div key={idx} style={{ position: 'relative' }}>
                                <img src={url} alt={`slide ${idx+1}`} style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0' }} />
                                <button type="button" onClick={() => setHeroSlides(prev => prev.filter((_, i) => i !== idx))} style={{ position: 'absolute', top: -6, right: -6, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: 20, height: 20, fontSize: 12, cursor: 'pointer', lineHeight: '20px', textAlign: 'center' }}>x</button>
                            </div>
                        ))}
                    </div>
                    <input type="file" accept="image/*" onChange={async (e) => {
                        if (!e.target.files[0]) return
                        const fd = new FormData(); fd.append('key', `heroSlide_${Date.now()}`); fd.append('image', e.target.files[0])
                        try {
                            const res = await fetch(`${API_URL}/api/settings/upload-image`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd })
                            const data = await res.json(); if (!res.ok) throw new Error(data.message)
                            setHeroSlides(prev => [...prev, data.url]); setUploadMsg('Slide added!')
                        } catch (err) { setUploadMsg(err.message || 'Upload failed') }
                        e.target.value = ''
                    }} style={{ fontSize: 12 }} />
                    <label style={{ ...ls, marginTop: 14 }}>Eyebrow Text<input name="heroEyebrow" value={form.heroEyebrow} onChange={handleChange} style={fs} /></label>
                    <label style={ls}>Main Title<input name="heroTitle" value={form.heroTitle} onChange={handleChange} style={fs} /></label>
                    <label style={ls}>Subtitle / Tagline<input name="heroSubtitle" value={form.heroSubtitle} onChange={handleChange} style={fs} placeholder="e.g. Educating young people to play a constructive role in society" /></label>
                </div>

                <div style={gs}>
                    <h3 style={{ marginBottom: 14, color: '#2E7D32' }}>Shop Section</h3>
                    <label style={ls}>Eyebrow<input name="shopSectionEyebrow" value={form.shopSectionEyebrow} onChange={handleChange} style={fs} /></label>
                    <label style={ls}>Heading<input name="shopSectionTitle" value={form.shopSectionTitle} onChange={handleChange} style={fs} /></label>
                </div>

                <div style={gs}>
                    <h3 style={{ marginBottom: 14, color: '#2E7D32' }}>News Section</h3>
                    <label style={ls}>Eyebrow<input name="newsSectionEyebrow" value={form.newsSectionEyebrow} onChange={handleChange} style={fs} /></label>
                    <label style={ls}>Heading<input name="newsSectionTitle" value={form.newsSectionTitle} onChange={handleChange} style={fs} /></label>
                    <h4 style={{ marginTop: 10, marginBottom: 10, fontSize: 14, color: '#475569' }}>News Cards Content</h4>
                    {newsCards.map((card, i) => (
                        <div key={card.id} style={cardBox}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#2E7D32', marginBottom: 8 }}>Card {i + 1}</div>
                            <Img label={`News Card ${i+1} Image`} settingKey={`newsImage${i+1}`} />
                            <label style={ls}>Title<input value={card.title} onChange={(e) => updateCard(setNewsCards, i, 'title', e.target.value)} style={fs} /></label>
                            <label style={ls}>Category<input value={card.category} onChange={(e) => updateCard(setNewsCards, i, 'category', e.target.value)} style={fs} /></label>
                            <label style={ls}>Text<textarea rows={2} value={card.text} onChange={(e) => updateCard(setNewsCards, i, 'text', e.target.value)} style={fs} /></label>
                        </div>
                    ))}
                </div>

                <div style={gs}>
                    <h3 style={{ marginBottom: 14, color: '#2E7D32' }}>Letters Section</h3>
                    <h4 style={{ marginTop: 0, marginBottom: 10, fontSize: 14, color: '#475569' }}>Letter Cards Content</h4>
                    {letterCards.map((card, i) => (
                        <div key={card.id} style={cardBox}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#2E7D32', marginBottom: 8 }}>Letter {i + 1}</div>
                            <label style={ls}>Title<input value={card.title} onChange={(e) => updateCard(setLetterCards, i, 'title', e.target.value)} style={fs} /></label>
                            <label style={ls}>Date<input value={card.date} onChange={(e) => updateCard(setLetterCards, i, 'date', e.target.value)} style={fs} placeholder="e.g. March 2026" /></label>
                            <label style={ls}>Text<textarea rows={2} value={card.text} onChange={(e) => updateCard(setLetterCards, i, 'text', e.target.value)} style={fs} /></label>
                        </div>
                    ))}
                </div>

                <div style={gs}>
                    <h3 style={{ marginBottom: 14, color: '#2E7D32' }}>Gallery Section</h3>
                    <label style={ls}>Eyebrow<input name="gallerySectionEyebrow" value={form.gallerySectionEyebrow} onChange={handleChange} style={fs} /></label>
                    <label style={ls}>Heading<input name="gallerySectionTitle" value={form.gallerySectionTitle} onChange={handleChange} style={fs} /></label>
                    <h4 style={{ marginTop: 10, marginBottom: 10, fontSize: 14, color: '#475569' }}>Gallery Cards</h4>
                    {galleryCards.map((card, i) => (
                        <div key={card.id} style={cardBox}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#2E7D32', marginBottom: 8 }}>Gallery Card {i + 1}</div>
                            <Img label={`Gallery Card ${i+1}`} settingKey={`galleryImage${i+1}`} />
                            <label style={ls}>Title<input value={card.title} onChange={(e) => updateCard(setGalleryCards, i, 'title', e.target.value)} style={fs} /></label>
                        </div>
                    ))}
                </div>

                <div style={gs}>
                    <h3 style={{ marginBottom: 14, color: '#2E7D32' }}>Call-to-Action Box</h3>
                    <label style={ls}>Eyebrow<input name="ctaEyebrow" value={form.ctaEyebrow} onChange={handleChange} style={fs} /></label>
                    <label style={ls}>Heading<input name="ctaTitle" value={form.ctaTitle} onChange={handleChange} style={fs} /></label>
                    <label style={ls}>Description<textarea name="ctaText" value={form.ctaText} onChange={handleChange} rows={3} style={fs} /></label>
                </div>

                {msg && <div className="success-box" style={{ marginBottom: 16 }}>{msg}</div>}

                <button type="submit" className="btn btn-green" disabled={saving} style={{ padding: '12px 32px', fontSize: 15 }}>
                    {saving ? 'Saving...' : 'Save All Changes'}
                </button>
            </form>
        </section>
    )
}

function AdminDocumentManager({ token, category, title }) {
    const [docs, setDocs] = useState([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({ isPublic: true, files: [] })

    const fetchDocs = useCallback(async () => {
        try {
            const r = await fetch(`${API_URL}/api/documents/admin/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await r.json()
            setDocs(Array.isArray(data) ? data.filter(d => d.category === category) : [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [token, category])

    useEffect(() => { fetchDocs() }, [fetchDocs])

    async function handleUpload(e) {
        e.preventDefault()
        if (!form.files || form.files.length === 0) return setError('Please select at least one file to upload')
        setUploading(true)
        setError('')

        const formData = new FormData()
        form.files.forEach(file => formData.append('documents', file))
        formData.append('category', category)
        formData.append('isPublic', form.isPublic)

        try {
            const r = await fetch(`${API_URL}/api/documents/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            })
            const data = await r.json()
            if (!r.ok) throw new Error(data.message || 'Upload failed')
            setForm({ isPublic: true, files: [] })
            // Re-render specifically clears the input field via state usually, but for file type inputs we might need to reset the actual DOM node. We'll let React handle its uncontrolled nature.
            fetchDocs()
        } catch (err) {
            setError(err.message)
        } finally {
            setUploading(false)
        }
    }

    async function handleDelete(id) {
        if (!window.confirm('Delete this document?')) return
        try {
            await fetch(`${API_URL}/api/documents/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            fetchDocs()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ margin: 0, color: '#2E7D32' }}>{title}</h2>
            </div>

            <div className="panel" style={{ marginBottom: 24 }}>
                <h3 style={{ marginTop: 0, fontSize: 16 }}>Upload New Document(s)</h3>
                <form onSubmit={handleUpload} style={{ display: 'grid', gap: 16, maxWidth: 600 }}>
                    <div style={{ display: 'grid', gap: 6 }}>
                        <label style={{ fontSize: 13, fontWeight: 600 }}>Files (PDF, Word, etc.)</label>
                        <input 
                            type="file" 
                            multiple
                            onChange={e => setForm({...form, files: Array.from(e.target.files)})}
                            style={{ border: '1px solid #cbd5e1', padding: 8, borderRadius: 8 }}
                        />
                        <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>You can select multiple files at once. Their names will be used as titles automatically.</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input 
                            type="checkbox" 
                            checked={form.isPublic}
                            onChange={e => setForm({...form, isPublic: e.target.checked})}
                        />
                        <label style={{ fontSize: 13 }}>Publicly visible</label>
                    </div>
                    {error && <div className="error-box">{error}</div>}
                    <button type="submit" className="btn btn-green" disabled={uploading} style={{ justifySelf: 'start' }}>
                        {uploading ? 'Uploading...' : 'Upload Document(s)'}
                    </button>
                </form>
            </div>

            <div className="panel">
                <h3 style={{ marginTop: 0, fontSize: 16, marginBottom: 16 }}>Existing Documents</h3>
                {loading ? (
                    <p>Loading...</p>
                ) : docs.length === 0 ? (
                    <p style={{ color: '#64748b' }}>No documents found.</p>
                ) : (
                    <div style={{ display: 'grid', gap: 12 }}>
                        {docs.map(doc => (
                            <div key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ color: '#2E7D32' }}>📄</div>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: 14 }}>{doc.title}</div>
                                        <div style={{ fontSize: 12, color: '#64748b' }}>{doc.originalName} • {new Date(doc.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    {!doc.isPublic && <span style={{ background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700 }}>PRIVATE</span>}
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <a href={doc.url} className="mini-btn" target="_blank" rel="noreferrer">View</a>
                                    <a href={doc.downloadUrl || doc.url} download={doc.originalName} className="mini-btn" style={{ background: '#e2e8f0', color: '#0f172a', textDecoration: 'none' }}>Download</a>
                                    <button className="mini-btn" style={{ background: '#fef2f2', color: '#dc2626' }} onClick={() => handleDelete(doc.id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

function AdminDownloadsManager({ token }) {
    return <AdminDocumentManager token={token} category="downloads" title="Downloads Manager" />
}

function AdminConstitutionManager({ token }) {
    return <AdminDocumentManager token={token} category="constitution" title="Constitution Manager" />
}