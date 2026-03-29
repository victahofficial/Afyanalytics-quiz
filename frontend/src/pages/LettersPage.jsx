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

export default function NewsPage() {
    return (
        <section className="mx-auto max-w-7xl px-6 py-14">
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-slate-500">News</p>
            <h1 className="mt-3 text-4xl font-extrabold">Latest Flamingo updates</h1>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
                {newsItems.map((item) => (
                    <article key={item.id} className="rounded-[28px] bg-white p-6 shadow-sm">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                            {item.category}
                        </span>
                        <h3 className="mt-4 text-2xl font-extrabold">{item.title}</h3>
                        <p className="mt-3 leading-7 text-slate-600">{item.text}</p>
                    </article>
                ))}
            </div>
        </section>
    )
}