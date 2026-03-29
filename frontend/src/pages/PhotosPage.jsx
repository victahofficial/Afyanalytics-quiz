const photos = [
    { id: 1, title: 'Camp Activity', image: '/images/photo-1.jpg' },
    { id: 2, title: 'Parade Day', image: '/images/photo-2.jpg' },
    { id: 3, title: 'Tree Planting', image: '/images/photo-3.jpg' },
    { id: 4, title: 'Scout Gathering', image: '/images/photo-4.jpg' },
]

export default function PhotosPage() {
    return (
        <section className="mx-auto max-w-7xl px-6 py-14">
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-slate-500">Photos</p>
            <h1 className="mt-3 text-4xl font-extrabold">Gallery</h1>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {photos.map((photo) => (
                    <article key={photo.id} className="overflow-hidden rounded-[28px] bg-white shadow-sm">
                        <img src={photo.image} alt={photo.title} className="h-64 w-full object-cover" />
                        <div className="p-5">
                            <h3 className="text-lg font-extrabold">{photo.title}</h3>
                            <a
                                href={photo.image}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-4 inline-block rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white"
                            >
                                Open photo
                            </a>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    )
}