import { Link } from 'react-router'

const cards = [
    {
        title: 'Shop Manager',
        text: 'Add products, change prices, upload product photos, and hide sold-out items.',
        href: '/admin/shop',
    },
    {
        title: 'News Manager',
        text: 'Create news stories, edit content, and publish important updates.',
        href: '/admin/news',
    },
    {
        title: 'Letters Manager',
        text: 'Upload letters, newsletters, notices, and downloadable files.',
        href: '/admin/letters',
    },
    {
        title: 'Gallery Manager',
        text: 'Upload website photos and manage gallery content from the admin side.',
        href: '/admin/photos',
    },
    {
        title: 'Meeting Notices',
        text: 'Prepare crew and general meeting notices for email and phone delivery.',
        href: '/admin/notices',
    },
]

export default function AdminDashboard() {
    return (
        <section>
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-slate-500">Admin</p>
            <h1 className="mt-3 text-4xl font-extrabold">Dashboard</h1>
            <p className="mt-3 max-w-3xl text-slate-600">
                This is the control room for your website. Next step, we wire these pages to the real database and upload endpoints.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {cards.map((card) => (
                    <Link key={card.title} to={card.href} className="rounded-[28px] bg-white p-6 shadow-sm transition hover:-translate-y-1">
                        <h2 className="text-2xl font-extrabold">{card.title}</h2>
                        <p className="mt-3 leading-7 text-slate-600">{card.text}</p>
                        <p className="mt-5 text-sm font-extrabold text-[#0d7a52]">Open manager →</p>
                    </Link>
                ))}
            </div>
        </section>
    )
}