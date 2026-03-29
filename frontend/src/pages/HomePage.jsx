import { Link } from 'react-router'

const quickLinks = [
    { label: 'Shop Gear', href: '/shop' },
    { label: 'Latest News', href: '/news' },
    { label: 'Official Letters', href: '/letters' },
    { label: 'Member Photos', href: '/photos' },
]

export default function HomePage() {
    return (
        <>
            <section
                className="relative overflow-hidden"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(15,23,42,0.48), rgba(15,23,42,0.48)), url(/images/hero.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
                    <div className="max-w-4xl">
                        <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-white/80">
                            Flamingo Rovers
                        </p>
                        <h1 className="mt-4 text-4xl font-extrabold leading-tight text-white md:text-6xl">
                            Public website for stories, shop, letters, photos, and member life.
                        </h1>
                        <p className="mt-5 max-w-3xl text-lg leading-8 text-white/90">
                            Clean public pages for everyone, and a separate admin side for managing products, prices, news, letters, photos, and meeting notices.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                to="/register"
                                className="rounded-full bg-[#19b24b] px-6 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#13933d]"
                            >
                                Join Flamingo
                            </Link>
                            <Link
                                to="/login"
                                className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-white/15"
                            >
                                Login
                            </Link>
                        </div>
                    </div>

                    <div className="mt-12 grid gap-4 md:grid-cols-4">
                        {quickLinks.map((item) => (
                            <Link
                                key={item.label}
                                to={item.href}
                                className="rounded-[28px] bg-white/12 px-5 py-6 text-white backdrop-blur-sm transition hover:bg-white/20"
                            >
                                <p className="text-lg font-extrabold">{item.label}</p>
                                <p className="mt-2 text-sm text-white/80">Open section</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto grid max-w-7xl gap-6 px-6 py-14 md:grid-cols-3">
                <div className="rounded-[28px] bg-white p-6 shadow-sm">
                    <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-slate-500">Public Site</p>
                    <h3 className="mt-3 text-2xl font-extrabold">Anyone can browse</h3>
                    <p className="mt-3 leading-7 text-slate-600">
                        Shop items, public news, letters, notices, photos, and contact information all stay open and easy to find.
                    </p>
                </div>

                <div className="rounded-[28px] bg-white p-6 shadow-sm">
                    <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-slate-500">Members</p>
                    <h3 className="mt-3 text-2xl font-extrabold">Login and register separately</h3>
                    <p className="mt-3 leading-7 text-slate-600">
                        No more mixing login buttons and registration inside the same homepage header. It stays cleaner now.
                    </p>
                </div>

                <div className="rounded-[28px] bg-white p-6 shadow-sm">
                    <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-slate-500">Admins</p>
                    <h3 className="mt-3 text-2xl font-extrabold">Manage everything in one dashboard</h3>
                    <p className="mt-3 leading-7 text-slate-600">
                        Product prices, images, news posts, letters, photos, and meeting notices all move to admin pages.
                    </p>
                </div>
            </section>
        </>
    )
}