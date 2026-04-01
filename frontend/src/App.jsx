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

const quickLinkIcons = {
    'Join': <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg>,
    'Scout': <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    'Calendar': <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    'Document': <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    'Download': <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    'Cart': <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
    'Image': <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    'Shield': <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    'Globe': <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    'Link': <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
}

const defaultQuickLinks = [
    { id: 1, label: 'Join\nScouting', url: '/register', icon: 'Join' },
    { id: 2, label: 'Scout\nMovement', url: '/page/scout-movement', icon: 'Scout' },
    { id: 3, label: 'Events\n& Camps', url: '/page/events-camps', icon: 'Calendar' },
    { id: 4, label: 'Official\nLetters', url: '/letters', icon: 'Document' },
    { id: 5, label: 'Resource\nDownloads', url: '/downloads', icon: 'Download' },
    { id: 6, label: 'Shop\nGear', url: '/shop', icon: 'Cart' },
    { id: 7, label: 'Photo\nGallery', url: '/photos', icon: 'Image' },
    { id: 8, label: 'Rover\nConstitution', url: '/constitution', icon: 'Shield' },
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
                <Route path="/search" element={<SearchPage />} />
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
                <Route path="links" element={<AdminLinkManager token={token} />} />
                <Route path="social" element={<AdminSocialManager token={token} />} />
            </Route>
        </Routes>
    )
}

function DynamicSocialStrip({ color = '#16a34a' }) {
    const [accounts, setAccounts] = useState([])

    useEffect(() => {
        fetch(`${API_URL}/api/social/feed`)
            .then(async r => {
                const text = await r.text()
                try { return JSON.parse(text) } catch (e) { return { accounts: [] } }
            })
            .then(data => setAccounts(Array.isArray(data?.accounts) ? data.accounts : []))
            .catch(() => {})
    }, [])

    const pIcons = {
        Facebook: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>,
        Instagram: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
        "Twitter (X)": <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
        TikTok: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>,
        YouTube: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
        LinkedIn: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zM7.119 20.452H3.554V9h3.565v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"/></svg>
    }

    if (accounts.length === 0) {
        return (
            <div className="social-strip">
                <a href="https://www.instagram.com/flamingoroverscouts/" target="_blank" rel="noopener noreferrer" title="Instagram" style={{ color: color }}>
                    {pIcons.Instagram}
                </a>
            </div>
        )
    }

    return (
        <div className="social-strip" style={{ display: 'flex', gap: '15px' }}>
            {accounts.map(acc => (
                <a key={acc.id} href={acc.url} target="_blank" rel="noopener noreferrer" title={acc.platform} style={{ display: 'flex', alignItems: 'center', color: color, transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform='scale(1.2)'} onMouseOut={e => e.currentTarget.style.transform='scale(1)'}>
                    {pIcons[acc.platform] || <span style={{ fontSize: 10 }}>{acc.platform}</span>}
                </a>
            ))}
        </div>
    )
}

function PublicLayout({ user, isAdmin, onLogout }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const navigate = useNavigate()

    const navItems = [
        { label: 'Home', to: '/' },
        { 
            label: 'Who We Are', 
            children: [
                { label: 'Scout Movement', to: '/page/scout-movement' },
                { label: 'Scouting Education', to: '/page/scouting-education' },
                { label: 'Scout Method', to: '/page/scout-method' },
                { label: 'Scout Promise & Law', to: '/page/scout-promise-law' },
                { label: 'Scouting\'s History', to: '/page/scouting-history' },
                { label: 'About Us', to: '/page/about-us' }
            ]
        },
        {
            label: 'What We Do',
            children: [
                { label: 'Environment', to: '/page/environment' },
                { label: 'Education', to: '/page/education' },
                { label: 'Peace', to: '/page/peace' },
                { label: 'Community Service', to: '/page/community-service' },
                { label: 'Events & Camps', to: '/page/events-camps' }
            ]
        },
        { label: 'Shop Gear', to: '/shop' },
        { label: 'News', to: '/news' },
        {
            label: 'Help & Support',
            children: [
                { label: 'Letters', to: '/letters' },
                { label: 'Photos', to: '/photos' },
                { label: 'Downloads', to: '/downloads' },
                { label: 'Constitution', to: '/constitution' }
            ]
        }
    ]

    return (
        <div className="site-shell">
            <header className="modern-header" style={{ background: 'white', position: 'fixed', top: 0, width: '100%', zIndex: 1000, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px', maxWidth: '1400px' }}>
                    <div className="brand-group" style={{ display: 'flex', alignItems: 'center' }}>
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '15px', textDecoration: 'none' }}>
                            <img src="/images/logo.jpeg" alt="Logo" style={{ height: '56px', width: '56px', objectFit: 'contain' }} />
                            <div className="brand-divider" style={{ width: '1px', height: '40px', background: '#e5e7eb' }}></div>
                            <div className="brand-name" style={{ fontSize: '24px', fontWeight: '800', color: '#111827', letterSpacing: '-0.5px' }}>Flamingo Rovers</div>
                        </Link>
                    </div>

                    <nav className="modern-nav-links" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        {navItems.map((item, idx) => (
                            item.children ? (
                                <div key={idx} className="nav-dropdown">
                                    <span className="nav-link" style={{ cursor: 'pointer', fontWeight: 600, color: '#4B5563' }}>{item.label}</span>
                                    <div className="dropdown-menu">
                                        {item.children.map((child, cidx) => (
                                            <Link key={cidx} to={child.to}>{child.label}</Link>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <NavLink key={idx} to={item.to} end className={({isActive}) => isActive ? "nav-link active" : "nav-link"} style={{ fontWeight: 600 }}>{item.label}</NavLink>
                            )
                        ))}
                    </nav>

                    <div className="modern-actions" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <svg 
                            className="action-icon search" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" 
                            style={{ cursor: 'pointer' }} 
                            onClick={() => window.location.href='/search'}
                        >
                            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                        
                        {user ? (
                            <div className="user-actions">
                                {isAdmin && <Link to="/admin/dashboard" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: 600, fontSize: 15, marginRight: 15 }}>Admin</Link>}
                                <span onClick={onLogout} style={{ color: '#4b5563', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Sign out</span>
                            </div>
                        ) : (
                            <div className="auth-actions">
                                <Link to="/login" style={{ color: '#4B5563', textDecoration: 'none', fontWeight: 600, fontSize: 15, marginRight: 15 }}>Sign in</Link>
                                <Link to="/register" style={{ background: '#10B981', color: 'white', padding: '10px 24px', borderRadius: '999px', textDecoration: 'none', fontWeight: 700, fontSize: 15 }}>Register</Link>
                            </div>
                        )}

                        <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ padding: 4, background: 'none', border: 'none' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2">
                                {mobileMenuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div className="mobile-menu-panel" style={{ position: 'fixed', top: '80px', left: 0, width: '100%', height: 'calc(100vh - 80px)', background: 'white', zIndex: 999, overflowY: 'auto', padding: '20px' }}>
                        <div style={{ display: 'grid', gap: '20px' }}>
                            {navItems.map((item, idx) => (
                                <div key={idx}>
                                    {item.children ? (
                                        <div style={{ marginBottom: '10px' }}>
                                            <div style={{ fontWeight: 800, color: '#111827', marginBottom: '10px', fontSize: '18px' }}>{item.label}</div>
                                            <div style={{ display: 'grid', gap: '10px', paddingLeft: '15px', borderLeft: '2px solid #e5e7eb' }}>
                                                {item.children.map((child, cidx) => (
                                                    <Link key={cidx} to={child.to} onClick={() => setMobileMenuOpen(false)} style={{ color: '#4b5563', textDecoration: 'none', fontSize: '16px' }}>{child.label}</Link>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <Link to={item.to} onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 800, color: '#111827', textDecoration: 'none', fontSize: '18px' }}>{item.label}</Link>
                                    )}
                                </div>
                            ))}
                            {!user && (
                                <div style={{ marginTop: '20px', display: 'grid', gap: '10px' }}>
                                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-light" style={{ width: '100%' }}>Sign in</Link>
                                    <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-green" style={{ width: '100%', background: '#10B981' }}>Register</Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </header>

            <div style={{ paddingTop: '80px' }}>
                <Outlet />
                <DynamicFooter />
            </div>
        </div>
    )
}

/* SOCIAL WALL COMPONENT FOR HOMEPAGE WITH NATIVE WIDGETS AND SLIDESHOW FALLBACK */
function TwitterEmbed({ url }) {
    useEffect(() => {
        const scriptId = 'twitter-wjs';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = "https://platform.twitter.com/widgets.js";
            script.async = true;
            document.body.appendChild(script);
        } else if (window.twttr && window.twttr.widgets) {
            window.twttr.widgets.load();
        }
    }, [url]);

    return (
        <div style={{ height: 380, overflowY: 'auto', background: 'white' }}>
            <a className="twitter-timeline" href={url} data-height="380">Tweets</a>
        </div>
    )
}

function HomeSocialWall() {
    const [accounts, setAccounts] = useState([])
    const [postsByPlatform, setPostsByPlatform] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`${API_URL}/api/social/feed`)
            .then(r => r.json())
            .then(data => {
                setAccounts(Array.isArray(data?.accounts) ? data.accounts : [])
                const grouped = {}
                if (Array.isArray(data?.posts)) {
                    data.posts.forEach(p => {
                        if (!grouped[p.platform]) grouped[p.platform] = []
                        if (grouped[p.platform].length < 2) grouped[p.platform].push(p)
                    })
                }
                setPostsByPlatform(grouped)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    if (loading) return null
    if (accounts.length === 0 && Object.keys(postsByPlatform).length === 0) return null

    const widgets = []

    // 1. Render Official Native Embed widgets for valid profiles
    accounts.forEach(acc => {
        if (!acc.isActive) return
        
        if (acc.platform === "Facebook" && acc.url.includes("facebook.com")) {
            widgets.push(
                <div key={`native-${acc.id}`} className="card social-widget-card" style={{ height: 420, overflow: "hidden", padding: 0 }}>
                    <div style={{ background: "#1877f2", color: "white", padding: "12px 20px", fontWeight: 800, fontSize: 13, textTransform: 'uppercase' }}>Facebook Feed</div>
                    <iframe title="FB Feed" src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(acc.url)}&tabs=timeline&width=340&height=380&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false`} width="100%" height="380" style={{border:"none",overflow:"hidden"}} scrolling="no" frameBorder="0" allowFullScreen={true} allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
                </div>
            )
        } else if ((acc.platform === "Twitter (X)" || acc.platform === "X") && (acc.url.includes("twitter.com") || acc.url.includes("x.com"))) {
            widgets.push(
                <div key={`native-${acc.id}`} className="card social-widget-card" style={{ height: 420, overflow: "hidden", padding: 0 }}>
                    <div style={{ background: "#000", color: "white", padding: "12px 20px", fontWeight: 800, fontSize: 13, textTransform: 'uppercase' }}>X (Twitter) Feed</div>
                    <TwitterEmbed url={acc.url} />
                </div>
            )
        }
    })

    // 2. Render Custom SlideShows for posts created manually in admin
    Object.entries(postsByPlatform).forEach(([platform, posts]) => {
        // Prevent duplicate panels if native widget is already showing for FB/Twitter
        if (platform === "Facebook" && accounts.some(a => a.platform === "Facebook" && a.isActive)) return
        if ((platform === "Twitter (X)" || platform === "X") && accounts.some(a => (a.platform.includes("X") || a.platform.includes("Twitter")) && a.isActive)) return
        
        widgets.push(
            <div key={`manual-${platform}`} className="card social-widget-card" style={{ height: 420, overflow: "hidden", padding: 0, position: 'relative' }}>
                <div style={{ background: "#00334e", color: "white", padding: "12px 20px", fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>
                    {platform} Highlights
                </div>
                <SocialSlideShow posts={posts} />
            </div>
        )
    })

    if (widgets.length === 0) return null

    return (
        <section className="container section">
            <div className="page-head">
                <p className="eyebrow">Connect with Us</p>
                <h2>Our Social Feeds</h2>
                <p>Stay updated with our latest stories from across our platforms.</p>
            </div>
            
            <div className="card-grid three">
                {widgets}
            </div>
        </section>
    )
}

function SocialSlideShow({ posts }) {
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        if (posts.length <= 1) return
        const t = setInterval(() => {
            setCurrent(s => (s + 1) % posts.length)
        }, 6000)
        return () => clearInterval(t)
    }, [posts.length])

    return (
        <div style={{ position: "relative", height: "100%", overflow: "hidden" }}>
            {posts.map((post, idx) => (
                <div key={post.id} style={{ 
                    position: "absolute", top: 0, left: 0, width: "100%", height: "100%", 
                    opacity: idx === current ? 1 : 0, 
                    transform: `translateX(${(idx - current) * 10}%)`,
                    transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                    padding: 24,
                    display: "flex",
                    flexDirection: "column"
                }}>
                    {post.imageUrl && (
                        <img src={post.imageUrl} alt="" style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 8, marginBottom: 16 }} />
                    )}
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: "#334155", flex: 1, overflow: "hidden" }}>{post.content}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>{new Date(post.postedAt).toLocaleDateString()}</span>
                        <a href={post.postUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, fontWeight: 700, color: "#16a34a", textDecoration: "none" }}>View Post →</a>
                    </div>
                </div>
            ))}
            {posts.length > 1 && (
                <div style={{ position: "absolute", bottom: 15, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 8 }}>
                    {posts.map((_, i) => (
                        <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i === current ? "#16a34a" : "#cbd5e1", transition: "all 0.3s" }} />
                    ))}
                </div>
            )}
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
    const activeQuickLinks = (() => { try { const q = JSON.parse(s.quickLinks || '[]'); return q.length > 0 ? q : defaultQuickLinks } catch { return defaultQuickLinks } })()
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
            <section className="hero-ecitizen" style={{ 
                position: 'relative', 
                height: '85vh', 
                minHeight: '650px', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'flex-end',
                overflow: 'hidden'
            }}>
                {/* Background Slideshow */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                    {slideImages.map((src, idx) => (
                        <div key={idx} style={{ 
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
                            backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center',
                            opacity: idx === activeSlide ? 1 : 0, transition: 'opacity 1.5s ease-in-out'
                        }} />
                    ))}
                    {/* Dark gradient overlay behind text to ensure readability regardless of image */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to right, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 100%)' }} />
                </div>

                {/* Text Block - Over image before overlay */}
                <div className="container" style={{ position: 'relative', zIndex: 10, marginBottom: '60px' }}>
                    <div style={{ maxWidth: '800px', paddingLeft: '20px' }}>
                        <h1 style={{ color: 'white', fontSize: 'clamp(32px, 4vw, 42px)', fontWeight: '800', lineHeight: '1.2', textShadow: '0 2px 10px rgba(0,0,0,0.5)', margin: 0 }}>
                            {s.heroTitle || 'Flamingo Rover services simplified'}
                        </h1>
                        <p style={{ color: 'white', fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: '700', margin: '10px 0 0', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                            {s.heroSubtitle || 'All your scouting records unified'}
                        </p>
                    </div>
                </div>

                {/* Dark Service Overlay */}
                <div className="service-overlay-container" style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '0 20px', paddingBottom: '20px', position: 'relative', zIndex: 20 }}>
                    <div style={{
                        background: 'rgba(20, 30, 20, 0.75)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        borderRadius: '24px',
                        padding: '40px',
                        width: '100%',
                        maxWidth: '1200px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
                    }}>
                        {/* Search Bar */}
                        <form 
                            onSubmit={(e) => {
                                e.preventDefault()
                                const q = e.target.q.value
                                if (!q) return
                                window.location.href = `/search?q=${encodeURIComponent(q)}`
                            }}
                            style={{ background: 'white', borderRadius: '999px', display: 'flex', alignItems: 'center', padding: '10px 24px', marginBottom: '40px' }}
                        >
                            <svg 
                                width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" 
                                style={{ marginRight: '12px', cursor: 'pointer' }}
                                onClick={(e) => {
                                    const formEl = e.currentTarget.closest('form');
                                    formEl.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
                                }}
                            >
                                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                            </svg>
                            <input 
                                name="q"
                                placeholder="Type name of service, event, records etc..." 
                                style={{ flex: 1, border: 'none', outline: 'none', fontSize: '18px', background: 'transparent', padding: '8px 0', color: '#1f2937' }} 
                            />
                            <button type="submit" style={{ display: 'none' }}></button>
                        </form>

                        {/* Icon Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '20px', textAlign: 'center' }}>
                            {activeQuickLinks.map((link) => (
                                <Link key={link.id} to={link.url} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'white', textDecoration: 'none', gap: '12px', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={e=>e.currentTarget.style.transform='translateY(-5px)'} onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>
                                    {quickLinkIcons[link.icon] || quickLinkIcons['Link']}
                                    <span style={{ fontSize: '14px', fontWeight: '600', lineHeight: '1.4', whiteSpace: 'pre-line' }}>{link.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>


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

            {/* Home Social Wall — Displacing older widgets */}
            <HomeSocialWall />

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

function SearchPage() {
    const query = new URLSearchParams(window.location.search).get('q') || ''
    const safeQuery = query.toLowerCase().trim()
    
    const results = []
    
    if (safeQuery) {
        Object.entries(pageContent).forEach(([slug, content]) => {
            if (content.title.toLowerCase().includes(safeQuery) || content.body.toLowerCase().includes(safeQuery)) {
                results.push({
                    title: content.title,
                    type: content.eyebrow || 'Page',
                    url: `/page/${slug}`,
                    snippet: content.body.substring(0, 150) + '...'
                })
            }
        })
        
        const statics = [
            { title: 'Shop Gear', type: 'Shop', url: '/shop', match: 'shop gear store buy scarf woggle uniform badge' },
            { title: 'News', type: 'Updates', url: '/news', match: 'news updates articles announcements' },
            { title: 'Letters', type: 'Documents', url: '/letters', match: 'letters official documents' },
            { title: 'Photos', type: 'Gallery', url: '/photos', match: 'photos gallery images pictures' },
            { title: 'Downloads', type: 'Resources', url: '/downloads', match: 'downloads forms resources pdf' },
            { title: 'Constitution', type: 'Rules', url: '/constitution', match: 'constitution rules bylaws' },
        ]
        
        statics.forEach(s => {
            if (s.title.toLowerCase().includes(safeQuery) || s.match.includes(safeQuery)) {
                results.push({ title: s.title, type: s.type, url: s.url, snippet: `View our ${s.title.toLowerCase()} section.` })
            }
        })
    }

    return (
        <section className="container page-section" style={{ minHeight: '60vh' }}>
            <div className="page-head left">
                <p className="eyebrow">Search Results</p>
                <h1 style={{ marginTop: 0 }}>Showing results for: "{query}"</h1>
            </div>
            
            <form action="/search" method="get" style={{ display: 'flex', gap: 10, maxWidth: 600, marginBottom: 40, marginTop: 24 }}>
                <input name="q" defaultValue={query} placeholder="Search again..." style={{ flex: 1, padding: '12px 20px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 16 }} />
                <button type="submit" className="btn btn-green">Search</button>
            </form>

            <div style={{ display: 'grid', gap: 20 }}>
                {query ? (
                    results.length > 0 ? (
                        results.map((r, i) => (
                            <div key={i} className="card" style={{ padding: 24, paddingBottom: 24 }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', marginBottom: 6 }}>{r.type}</div>
                                <h2><Link to={r.url} style={{ color: '#1e293b', textDecoration: 'none' }}>{r.title}</Link></h2>
                                <p style={{ color: '#475569', marginTop: 10, fontSize: 15 }}>{r.snippet}</p>
                            </div>
                        ))
                    ) : (
                        <div className="panel"><p>No results found for "{query}". Try a different term.</p></div>
                    )
                ) : (
                    <div className="panel"><p>Enter a search term above to find what you're looking for.</p></div>
                )}
            </div>
        </section>
    )
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
                const text = await r.text()
                try {
                    const data = JSON.parse(text)
                    if (data) {
                        setPage({ ...fallback, ...data }) 
                        setForm({ title: data.title, eyebrow: data.eyebrow || '', body: data.body })
                        return
                    }
                } catch(e) {}
            }
            // Fallback for not found or bad json
            setPage(fallback)
            if (fallback) setForm({ title: fallback.title, eyebrow: fallback.eyebrow || '', body: fallback.body })
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
    const navigate = useNavigate()
    const [collapsed, setCollapsed] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [showNotifications, setShowNotifications] = useState(false)
    const [stats, setStats] = useState({ pending: 0 })

    useEffect(() => {
        const token = localStorage.getItem('flamingo_token')
        fetch(`${API_URL}/api/stats`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json())
            .then(data => setStats(data))
            .catch(() => {})
    }, [])

    return (
        <div className="admin-shell">
            <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
                <div className="admin-sidebar-brand-active">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    <span className="sidebar-label">Admin Dashboard</span>
                </div>

                <nav className="admin-nav">
                    <NavLink to="/admin/dashboard" className={({ isActive }) => adminNavClass(isActive)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                        <span className="sidebar-label">Main View</span>
                    </NavLink>
                    <NavLink to="/admin/shop" className={({ isActive }) => adminNavClass(isActive)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                        <span className="sidebar-label">Shop Manager</span>
                    </NavLink>
                    <NavLink to="/admin/news" className={({ isActive }) => adminNavClass(isActive)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        <span className="sidebar-label">News & Blogs</span>
                    </NavLink>
                    <NavLink to="/admin/letters" className={({ isActive }) => adminNavClass(isActive)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                        <span className="sidebar-label">Letters</span>
                    </NavLink>
                    <NavLink to="/admin/photos" className={({ isActive }) => adminNavClass(isActive)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                        <span className="sidebar-label">Gallery Manager</span>
                    </NavLink>
                    <NavLink to="/admin/homepage-editor" className={({ isActive }) => adminNavClass(isActive)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                        <span className="sidebar-label">Home Editor</span>
                    </NavLink>
                    <NavLink to="/admin/downloads" className={({ isActive }) => adminNavClass(isActive)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        <span className="sidebar-label">Downloads</span>
                    </NavLink>
                    <NavLink to="/admin/users" className={({ isActive }) => adminNavClass(isActive)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        <span className="sidebar-label">Users List</span>
                    </NavLink>
                    <NavLink to="/admin/links" className={({ isActive }) => adminNavClass(isActive)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                        <span className="sidebar-label">Link Manager</span>
                    </NavLink>
                    <NavLink to="/admin/social" className={({ isActive }) => adminNavClass(isActive)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                        <span className="sidebar-label">Social Media</span>
                    </NavLink>
                </nav>

                <div style={{ padding: '0 16px 24px', fontSize: 10, color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                    {!collapsed && "©2026 - lance media"}
                </div>
            </aside>

            <div className="admin-content-shell">
                <header className="admin-topbar">
                    <div className="admin-topbar-left">
                        <div className="admin-toggle-btn" onClick={() => setCollapsed(!collapsed)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                        </div>
                        <img 
                            src="/images/logo.jpeg" 
                            alt="Flamingo Rovers" 
                            style={{ height: 50, width: 50, objectFit: 'contain', cursor: 'pointer' }} 
                            onClick={() => navigate('/')}
                        />
                        <span className="admin-university-name">Flamingo Rovers</span>
                    </div>

                    <div className="admin-topbar-right">
                        <div className="relative-dropdown">
                            <div className="admin-top-action" onClick={() => setShowNotifications(!showNotifications)}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                                {stats?.pending > 0 && <span className="admin-notification-badge"></span>}
                            </div>
                            {showNotifications && (
                                <div className="dropdown-pop" style={{ width: 280 }}>
                                    <div style={{ padding: 12, borderBottom: '1px solid #f1f5f9', fontWeight: 800 }}>Notifications</div>
                                    <div style={{ padding: 12 }}>
                                        {stats?.pending > 0 ? (
                                            <Link to="/admin/users" onClick={() => setShowNotifications(false)} style={{ display: 'flex', gap: 12 }}>
                                                <div style={{ background: '#f0fdf4', width: 40, height: 40, borderRadius: 8, display: 'grid', placeItems: 'center' }}>🎉</div>
                                                <div>
                                                    <div style={{ fontSize: 13, fontWeight: 700 }}>{stats.pending} New Registrations</div>
                                                    <div style={{ fontSize: 11, color: '#64748b' }}>Members awaiting approval</div>
                                                </div>
                                            </Link>
                                        ) : (
                                            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '20px 0', fontSize: 13 }}>No new notifications</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="relative-dropdown">
                            <div className="admin-user-profile" onClick={() => setShowUserMenu(!showUserMenu)}>
                                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f1f5f9', display: 'grid', placeItems: 'center', fontWeight: 800, color: '#1B5E20' }}>
                                    {user?.fullName?.charAt(0) || 'A'}
                                </div>
                                <span style={{ fontWeight: 700, color: '#334155' }}>Hi, {user?.fullName?.split(' ')[0] || 'Admin'}</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </div>
                            
                            {showUserMenu && (
                                <div className="dropdown-pop">
                                    <div style={{ padding: 12, borderBottom: '1px solid #f1f5f9' }}>
                                        <div style={{ fontWeight: 800 }}>{user?.fullName}</div>
                                        <div style={{ fontSize: 12, color: '#64748b' }}>{user?.email}</div>
                                    </div>
                                    <div style={{ padding: 4 }}>
                                        <button onClick={onLogout} style={{ width: '100%', padding: '10px 12px', textAlign: 'left', border: 'none', background: 'none', color: '#ef4444', fontWeight: 700, fontSize: 14, borderRadius: 8, cursor: 'pointer' }} className="hover:bg-red-50">
                                            Logout from Panel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="admin-main">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

function AdminDashboard({ isSuperAdmin, user, token }) {
    const [stats, setStats] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        fetch(`${API_URL}/api/stats`, { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => r.json())
            .then((data) => setStats(data))
            .catch(() => {})
    }, [token])

    return (
        <section>
            <div className="welcome-card">
                <div className="welcome-copy">
                    <p style={{ color: '#1B5E20', fontWeight: 800, textTransform: 'uppercase', fontSize: 13, letterSpacing: 0.5, marginBottom: 8 }}>Scout Admin</p>
                    <h1>Welcome, {user?.fullName?.split(' ')[0] || 'Admin'}</h1>
                    <p>Flamingo Rovers Scout Group Portal. Manage your shop, members, and resources from this central hub.</p>
                </div>
                <div className="welcome-illustration">
                    <img src="/images/logo.jpeg" alt="Logo" style={{ width: 120, height: 120, objectFit: 'contain' }} />
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="main-stats-area">
                    <div style={{ background: 'white', borderRadius: 16, padding: 32, border: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <h2 style={{ fontSize: 18, color: '#1B5E20', margin: 0 }}>Membership Status</h2>
                            <span onClick={() => navigate('/admin/users')} style={{ color: '#2E7D32', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>View All</span>
                        </div>
                        
                        {stats ? (
                             <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #f1f5f9', textAlign: 'left' }}>
                                        <th style={{ padding: '12px 0', fontSize: 13, color: '#94a3b8' }}>Unit Type</th>
                                        <th style={{ padding: '12px 0', fontSize: 13, color: '#94a3b8' }}>Count</th>
                                        <th style={{ padding: '12px 0', fontSize: 13, color: '#94a3b8' }}>Badge</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{ padding: '16px 0', fontWeight: 600 }}>Total Rovers</td>
                                        <td style={{ padding: '16px 0' }}>{stats.members}</td>
                                        <td style={{ padding: '16px 0' }}><span style={{ color: '#16a34a', background: '#f0fdf4', padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700 }}>Scout</span></td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '16px 0', fontWeight: 600 }}>Administrative Staff</td>
                                        <td style={{ padding: '16px 0' }}>{stats.admins}</td>
                                        <td style={{ padding: '16px 0' }}><span style={{ color: '#ca8a04', background: '#fefce8', padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700 }}>Leader</span></td>
                                    </tr>
                                </tbody>
                             </table>
                        ) : <p>Loading stats...</p>}
                    </div>
                </div>

                <div className="side-cards-area">
                    <div className="stat-card-blue" style={{ marginBottom: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                             <div style={{ background: 'rgba(255,255,255,0.2)', width: 50, height: 50, borderRadius: '50%', display: 'grid', placeItems: 'center' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                             </div>
                             <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: 20, fontWeight: 800 }}>Users Summary</div>
                                <div style={{ fontSize: 13, opacity: 0.8 }}>Total registered members</div>
                             </div>
                        </div>
                        <div style={{ marginTop: 24 }}>
                             <div style={{ fontSize: 32, fontWeight: 800 }}>{stats?.totalUsers || 0}</div>
                             <div style={{ fontSize: 14, opacity: 0.9, marginTop: 4 }}>Active Database Records</div>
                        </div>
                        <button onClick={() => navigate('/admin/users')} style={{ marginTop: 20, width: '100%', padding: '12px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}>View Details</button>
                    </div>

                    <div className="stat-card-purple">
                        <div style={{ marginBottom: 12, fontSize: 13, fontWeight: 700, opacity: 0.9 }}>KENYA SCOUTS PRIDE</div>
                        <div style={{ fontSize: 15, fontWeight: 600 }}>System Integrity</div>
                        <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>Site Uptime & Logs</div>
                        <div style={{ marginTop: 20, height: 10, background: 'rgba(255,255,255,0.1)', borderRadius: 5, position: 'relative' }}>
                             <div style={{ position: 'absolute', inset: 0, width: '92%', background: 'white', opacity: 0.9, borderRadius: 5 }}></div>
                        </div>
                        <div style={{ marginTop: 10, textAlign: 'right', fontSize: 12, fontWeight: 700 }}>92% Healthy</div>
                    </div>
                </div>
            </div>
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
    const [quickLinks, setQuickLinks] = useState(defaultQuickLinks)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [msg, setMsg] = useState('')
    const [uploadMsg, setUploadMsg] = useState('')
    const isSuperAdmin = getStoredUser()?.role === 'superadmin'

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
                try { const ql = JSON.parse(data.quickLinks); if (Array.isArray(ql) && ql.length > 0) setQuickLinks(ql) } catch {}
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
                quickLinks: JSON.stringify(quickLinks),
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
                    <h3 style={{ marginBottom: 14, color: '#2E7D32' }}>Quick Access Links (Hero)</h3>
                    <p style={{ fontSize: 13, color: '#64748b', marginBottom: 14 }}>Manage the 8 shortcut links displayed inside the dark overlay on the homepage hero section.</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 16 }}>
                        {quickLinks.map((link, idx) => (
                            <div key={link.id || idx} style={{ ...cardBox, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 600, fontSize: 14, color: '#334155' }}>Shortcut #{idx + 1}</span>
                                    {isSuperAdmin && <button type="button" onClick={() => setQuickLinks(prev => prev.filter((_, i) => i !== idx))} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '4px 8px', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>Remove</button>}
                                </div>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>Label (use \n for line break)</label>
                                    <input value={link.label} onChange={e => updateCard(setQuickLinks, idx, 'label', e.target.value)} style={{ ...fs, marginTop: 0 }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>URL Path / Link</label>
                                    <input value={link.url} onChange={e => updateCard(setQuickLinks, idx, 'url', e.target.value)} style={{ ...fs, marginTop: 0 }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>Icon</label>
                                    <select value={link.icon} onChange={e => updateCard(setQuickLinks, idx, 'icon', e.target.value)} style={{ ...fs, marginTop: 0, padding: '10px 14px' }}>
                                        {Object.keys(quickLinkIcons).map(iconName => (
                                            <option key={iconName} value={iconName}>{iconName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                    {isSuperAdmin && (
                        <button type="button" onClick={() => setQuickLinks(prev => [...prev, { id: Date.now(), label: 'New Link', url: '/', icon: 'Link' }])} style={{ marginTop: 16, background: '#10b981', color: 'white', padding: '8px 16px', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>+ Add Shortcut Link</button>
                    )}
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

function SocialFeedWidget() {
    const [posts, setPosts] = useState([])
    const [index, setIndex] = useState(0)

    useEffect(() => {
        fetch(`${API_URL}/api/social/feed`)
            .then(r => r.json())
            .then(data => setPosts(Array.isArray(data?.posts) ? data.posts : []))
            .catch(() => {})
    }, [])

    useEffect(() => {
        if (posts.length <= 1) return
        const iv = setInterval(() => {
            setIndex(i => (i + 1) % posts.length)
        }, 5000)
        return () => clearInterval(iv)
    }, [posts.length])

    if (posts.length === 0) return null

    const p = posts[index]

    return (
        <div className="social-feed-widget" style={{ minHeight: '180px', position: 'relative' }}>
            <h4 style={{ marginBottom: '15px' }}>Latest from Social Media</h4>
            
            <div 
                className="social-post-card" 
                key={p.id}
                style={{ 
                    animation: 'fadeIn 0.5s ease-out',
                    background: 'rgba(255,255,255,0.05)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}
            >
                <div className="social-post-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span className="platform-tag" style={{ background: '#16a34a', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 800 }}>{p.platform}</span>
                    <span className="post-date" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{new Date(p.postedAt).toLocaleDateString()}</span>
                </div>
                <p style={{ margin: '0 0 12px 0', fontSize: '14px', lineHeight: 1.5, color: 'rgba(255,255,255,0.9)', height: '3em', overflow: 'hidden' }}>{p.content}</p>
                {p.postUrl && (
                    <a href={p.postUrl} target="_blank" rel="noreferrer" className="view-original" style={{ color: '#16a34a', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
                        View on {p.platform} →
                    </a>
                )}
            </div>

            {posts.length > 1 && (
                <div style={{ display: 'flex', gap: '6px', marginTop: '12px', justifyContent: 'center' }}>
                    {posts.map((_, i) => (
                        <div key={i} onClick={() => setIndex(i)} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i === index ? '#16a34a' : 'rgba(255,255,255,0.2)', cursor: 'pointer' }} />
                    ))}
                </div>
            )}
        </div>
    )
}

function DynamicFooter() {
    const [columns, setColumns] = useState({ 1: [], 2: [], 3: [], 4: [] })
    const [accounts, setAccounts] = useState([])

    useEffect(() => {
        fetch(`${API_URL}/api/links`)
            .then(async r => {
                if (!r.ok) return []
                const text = await r.text()
                try { return JSON.parse(text) } catch (e) { return [] }
            })
            .then(data => {
                const cols = { 1: [], 2: [], 3: [], 4: [] }
                if (Array.isArray(data)) {
                    data.forEach(l => { if (cols[l.column]) cols[l.column].push(l) })
                }
                setColumns(cols)
            })
            .catch(() => {})

        fetch(`${API_URL}/api/social/feed`)
            .then(async r => {
                if (!r.ok) return { accounts: [] }
                const text = await r.text()
                try { return JSON.parse(text) } catch (e) { return { accounts: [] } }
            })
            .then(data => setAccounts(Array.isArray(data?.accounts) ? data.accounts.filter(a => a.isActive) : []))
            .catch(() => {})
    }, [])

    return (
        <footer className="main-footer">
            <div className="container footer-content">
                <div className="footer-grid">
                    <div className="footer-brand-col">
                        <img src="/images/logo.jpeg" alt="Flamingo Rovers" style={{ height: 60, marginBottom: 16, objectFit: 'contain' }} />
                        <h3>Flamingo Rover Scouts</h3>
                        <p>Educating young people to play a constructive role in society through a value system based on the Scout Promise and Law.</p>
                        <div className="footer-social-links" style={{ marginTop: '20px' }}>
                            <DynamicSocialStrip color="white" />
                        </div>
                    </div>

                    <div className="footer-links-col">
                        <h4>About Us</h4>
                        <div className="footer-links-list">
                            {columns[1].map(l => <a key={l.id} href={l.url} style={{ display: 'block', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', marginBottom: 8, fontSize: 14 }}>{l.title}</a>)}
                            {columns[1].length === 0 && <><Link to="/page/about-us" style={{ display: 'block', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', marginBottom: 8, fontSize: 14 }}>About Us</Link><Link to="/page/scout-method" style={{ display: 'block', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', marginBottom: 8, fontSize: 14 }}>Scout Method</Link></>}
                        </div>
                    </div>

                    <div className="footer-links-col">
                        <h4>Quick Links</h4>
                        <div className="footer-links-list">
                            {columns[2].map(l => <a key={l.id} href={l.url} style={{ display: 'block', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', marginBottom: 8, fontSize: 14 }}>{l.title}</a>)}
                            {columns[2].length === 0 && <><Link to="/shop" style={{ display: 'block', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', marginBottom: 8, fontSize: 14 }}>Shop</Link><Link to="/news" style={{ display: 'block', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', marginBottom: 8, fontSize: 14 }}>News</Link></>}
                        </div>
                    </div>

                    <div className="footer-widget-col">
                        <SocialFeedWidget />
                    </div>
                </div>
                <div className="footer-bottom" style={{ marginTop: 40, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20, textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                    <p>© 2026 Flamingo Rover Scouts. Powered by ABNO Softwares International. | <Link to="/login" style={{ color: 'white' }}>Portal Access</Link></p>
                </div>
            </div>
        </footer>
    )
}
function AdminLinkManager({ token }) {
    const [links, setLinks] = useState([])
    const [loading, setLoading] = useState(true)
    const [form, setForm] = useState({ title: "", url: "", column: 2, order: 0 })
    const [editingId, setEditingId] = useState(null)

    const fetchLinks = useCallback(async () => {
        try {
            const r = await fetch(`${API_URL}/api/links/admin`, {
                headers: { "Authorization": `Bearer ${token}` }
            })
            const data = await r.json()
            setLinks(Array.isArray(data) ? data : [])
            setLoading(false)
        } catch (err) { console.error(err); setLoading(false) }
    }, [token])

    useEffect(() => { fetchLinks() }, [fetchLinks])

    async function handleSubmit(e) {
        e.preventDefault()
        const method = editingId ? "PUT" : "POST"
        const url = editingId ? `${API_URL}/api/links/${editingId}` : `${API_URL}/api/links`
        
        try {
            const r = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(form)
            })
            if (r.ok) {
                setForm({ title: "", url: "", column: 2, order: 0 })
                setEditingId(null)
                fetchLinks()
            }
        } catch (err) { console.error(err) }
    }

    async function handleDelete(id) {
        if (!confirm("Delete this link?")) return
        try {
            await fetch(`${API_URL}/api/links/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            })
            fetchLinks()
        } catch (err) { console.error(err) }
    }

    return (
        <div style={{ padding: 24 }}>
            <h2 style={{ color: "#1B5E20", marginBottom: 24 }}>Manage Footer Links</h2>
            <div className="panel" style={{ marginBottom: 24 }}>
                <h3 style={{ marginTop: 0 }}>{editingId ? "Edit Link" : "Add New Link"}</h3>
                <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1.5fr 0.8fr 0.5fr auto", alignItems: "end" }}>
                    <div>
                        <label style={{ fontSize: 13, fontWeight: 700 }}>Label</label>
                        <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd" }} required />
                    </div>
                    <div>
                        <label style={{ fontSize: 13, fontWeight: 700 }}>URL</label>
                        <input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd" }} required />
                    </div>
                    <div>
                        <label style={{ fontSize: 13, fontWeight: 700 }}>Column</label>
                        <select value={form.column} onChange={e => setForm({ ...form, column: e.target.value })} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd" }}>
                            <option value={1}>Column 1 (About)</option>
                            <option value={2}>Column 2 (Quick Links)</option>
                            <option value={3}>Column 3 (Useful Links)</option>
                            <option value={4}>Column 4 (Opportunities)</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: 13, fontWeight: 700 }}>Order</label>
                        <input type="number" value={form.order} onChange={e => setForm({ ...form, order: e.target.value })} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd" }} />
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                        <button type="submit" className="btn btn-green">{editingId ? "Update" : "Add Link"}</button>
                        {editingId && <button type="button" className="btn btn-light" onClick={() => { setEditingId(null); setForm({ title: "", url: "", column: 2, order: 0 }) }}>Cancel</button>}
                    </div>
                </form>
            </div>

            <div className="panel">
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ textAlign: "left", borderBottom: "2px solid #eee" }}>
                            <th style={{ padding: 12 }}>Title</th>
                            <th style={{ padding: 12 }}>URL</th>
                            <th style={{ padding: 12 }}>Column</th>
                            <th style={{ padding: 12 }}>Order</th>
                            <th style={{ padding: 12 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {links.map(l => (
                            <tr key={l.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                                <td style={{ padding: 12, fontWeight: 600 }}>{l.title}</td>
                                <td style={{ padding: 12, fontSize: 13, color: "#666" }}>{l.url}</td>
                                <td style={{ padding: 12 }}>Column {l.column}</td>
                                <td style={{ padding: 12 }}>{l.order}</td>
                                <td style={{ padding: 12 }}>
                                    <button className="mini-btn" onClick={() => { setEditingId(l.id); setForm({ title: l.title, url: l.url, column: l.column, order: l.order }) }}>Edit</button>
                                    <button className="mini-btn" style={{ background: "#fef2f2", color: "#ef4444", marginLeft: 8 }} onClick={() => handleDelete(l.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function AdminSocialManager({ token }) {
    const [accounts, setAccounts] = useState([])
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [postForm, setPostForm] = useState({ platform: "Facebook", content: "", postUrl: "", imageUrl: "" })
    const [accountForm, setAccountForm] = useState({ platform: "Facebook", url: "", isActive: true })
    const [editingAccountId, setEditingAccountId] = useState(null)
    const [syncing, setSyncing] = useState(false)
    const [syncMsg, setSyncMsg] = useState("")

    const fetchData = useCallback(async () => {
        try {
            const [accRes, postRes] = await Promise.all([
                fetch(`${API_URL}/api/social/accounts`, { headers: { "Authorization": `Bearer ${token}` } }),
                fetch(`${API_URL}/api/social/posts`, { headers: { "Authorization": `Bearer ${token}` } })
            ])
            const accData = await accRes.json()
            const postData = await postRes.json()
            setAccounts(Array.isArray(accData) ? accData : [])
            setPosts(Array.isArray(postData) ? postData : [])
            setLoading(false)
        } catch (err) { console.error(err); setLoading(false) }
    }, [token])

    useEffect(() => { fetchData() }, [fetchData])

    async function handlePostSubmit(e) {
        e.preventDefault()
        try {
            const r = await fetch(`${API_URL}/api/social/posts`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(postForm)
            })
            if (r.ok) {
                setPostForm({ platform: "Facebook", content: "", postUrl: "", imageUrl: "" })
                fetchData()
            }
        } catch (err) { console.error(err) }
    }

    async function handleAccountSubmit(e) {
        e.preventDefault()
        const method = editingAccountId ? "PUT" : "POST"
        const url = editingAccountId ? `${API_URL}/api/social/accounts/${editingAccountId}` : `${API_URL}/api/social/accounts`
        try {
            const r = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(accountForm)
            })
            if (r.ok) {
                setAccountForm({ platform: "Facebook", url: "", isActive: true })
                setEditingAccountId(null)
                fetchData()
            }
        } catch (err) { console.error(err) }
    }

    async function handleRemovePost(id) {
        if (!confirm("Remove this post from widget?")) return
        try {
            await fetch(`${API_URL}/api/social/posts/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            })
            fetchData()
        } catch (err) { console.error(err) }
    }

    async function handleMetaSync() {
        setSyncing(true)
        setSyncMsg("Syncing with Meta...")
        try {
            const r = await fetch(`${API_URL}/api/social/sync`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            })
            const data = await r.json()
            setSyncMsg(data.message || "Sync complete")
            fetchData()
        } catch (err) { 
            console.error(err)
            setSyncMsg("Sync failed. Check backend logs and .env configuration.")
        } finally {
            setSyncing(false)
            setTimeout(() => setSyncMsg(""), 5000)
        }
    }

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ color: "#1B5E20", margin: 0 }}>Social Media & Posts Widget</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                    {syncMsg && <span style={{ fontSize: 13, color: syncing ? '#1B5E20' : '#64748b', fontWeight: 600 }}>{syncMsg}</span>}
                    <button 
                        className="btn btn-green" 
                        onClick={handleMetaSync} 
                        disabled={syncing}
                        style={{ padding: '8px 20px', fontSize: 14, opacity: syncing ? 0.6 : 1 }}
                    >
                        {syncing ? 'Syncing...' : 'Sync with Meta API'}
                    </button>
                </div>
            </div>
            <div className="dashboard-grid">
                <section>
                    <div className="panel" style={{ marginBottom: 24 }}>
                        <h3 style={{ marginTop: 0 }}>Create Social Post (Mock Feed)</h3>
                        <p style={{ fontSize: 13, color: "#64748b" }}>These will appear in the "Social Media Posts" widget in the footer.</p>
                        <form onSubmit={handlePostSubmit} style={{ display: "grid", gap: 16 }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                <div>
                                    <label style={{ fontSize: 13, fontWeight: 700 }}>Platform</label>
                                    <select value={postForm.platform} onChange={e => setPostForm({ ...postForm, platform: e.target.value })} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd" }}>
                                        <option>Facebook</option>
                                        <option>Twitter (X)</option>
                                        <option>Instagram</option>
                                        <option>YouTube</option>
                                        <option>TikTok</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: 13, fontWeight: 700 }}>Post/External URL</label>
                                    <input value={postForm.postUrl} onChange={e => setPostForm({ ...postForm, postUrl: e.target.value })} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd" }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 700 }}>Post Image URL (Optional)</label>
                                <input value={postForm.imageUrl} onChange={e => setPostForm({ ...postForm, imageUrl: e.target.value })} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd" }} placeholder="https://..." />
                            </div>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 700 }}>Content / Text</label>
                                <textarea value={postForm.content} onChange={e => setPostForm({ ...postForm, content: e.target.value })} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd", minHeight: 80 }} required />
                            </div>
                            <button type="submit" className="btn btn-green">Push to Widget</button>
                        </form>
                    </div>

                    <div className="panel">
                        <h3 style={{ marginTop: 0 }}>Latest Widget Posts</h3>
                        {posts.slice(0, 5).map(p => (
                            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12, background: "#f8fafc", borderRadius: 8, marginBottom: 8 }}>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 14 }}>{p.platform} - {new Date(p.postedAt).toLocaleDateString()}</div>
                                    <div style={{ fontSize: 13, color: "#475569" }}>{p.content.substring(0, 60)}...</div>
                                </div>
                                <button className="mini-btn" style={{ background: "#fef2f2", color: "#ef4444" }} onClick={() => handleRemovePost(p.id)}>Remove</button>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <div className="panel" style={{ marginBottom: 24 }}>
                        <h3 style={{ marginTop: 0 }}>{editingAccountId ? "Edit Account" : "Add Social Account"}</h3>
                        <form onSubmit={handleAccountSubmit} style={{ display: "grid", gap: 16 }}>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 700 }}>Platform</label>
                                <select value={accountForm.platform} onChange={e => setAccountForm({ ...accountForm, platform: e.target.value })} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd" }}>
                                    <option>Facebook</option>
                                    <option>Twitter (X)</option>
                                    <option>Instagram</option>
                                    <option>YouTube</option>
                                    <option>LinkedIn</option>
                                    <option>TikTok</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: 13, fontWeight: 700 }}>Profile URL</label>
                                <input value={accountForm.url} onChange={e => setAccountForm({ ...accountForm, url: e.target.value })} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd" }} placeholder="https://facebook.com/..." required />
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <input type="checkbox" checked={accountForm.isActive} onChange={e => setAccountForm({ ...accountForm, isActive: e.target.checked })} id="is_active" />
                                <label htmlFor="is_active" style={{ fontSize: 13, fontWeight: 700 }}>Show in footer</label>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                <button type="submit" className="btn btn-green">{editingAccountId ? "Update Account" : "Add Account"}</button>
                                {editingAccountId && <button type="button" className="btn btn-light" onClick={() => { setEditingAccountId(null); setAccountForm({ platform: "Facebook", url: "", isActive: true }) }}>Cancel</button>}
                            </div>
                        </form>
                    </div>

                    <div className="panel">
                        <h3 style={{ marginTop: 0 }}>Active Social Media Accounts</h3>
                        <p style={{ fontSize: 13, color: "#64748b" }}>Manage the links to your official profiles.</p>
                        {accounts.map(acc => (
                            <div key={acc.id} style={{ padding: 12, border: "1px solid #eee", borderRadius: 8, marginBottom: 12, background: acc.isActive ? "white" : "#f1f5f9" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                                    <div>
                                        <div style={{ fontWeight: 800 }}>{acc.platform}</div>
                                        <div style={{ fontSize: 12, color: "#2563eb", marginBottom: 8, wordBreak: "break-all" }}>{acc.url}</div>
                                    </div>
                                    <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: acc.isActive ? "#dcfce7" : "#f1f5f9", color: acc.isActive ? "#166534" : "#475569", fontWeight: 700 }}>
                                        {acc.isActive ? "ACTIVE" : "HIDDEN"}
                                    </span>
                                </div>
                                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                                    <button className="mini-btn" onClick={() => { setEditingAccountId(acc.id); setAccountForm({ platform: acc.platform, url: acc.url, isActive: acc.isActive }) }}>Edit</button>
                                    <button className="mini-btn" style={{ background: "#fef2f2", color: "#ef4444" }} onClick={async () => {
                                        if (confirm("Delete this account link?")) {
                                            await fetch(`${API_URL}/api/social/accounts/${acc.id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token}` } })
                                            fetchData()
                                        }
                                    }}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}

