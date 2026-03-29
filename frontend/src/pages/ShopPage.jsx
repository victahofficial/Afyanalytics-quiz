import { useEffect, useState } from 'react'

const fallbackItems = [
    {
        id: 1,
        name: 'Flamingo Scout Scarf',
        price: 850,
        category: 'Scarfs',
        image: '/images/scarf.jpg',
        description: 'Official-style scarf for parades, camps, meetings, and public events.',
    },
    {
        id: 2,
        name: 'Classic Wooden Woggle',
        price: 300,
        category: 'Woggles',
        image: '/images/woggle.jpg',
        description: 'Simple scarf woggle for everyday uniform use.',
    },
]

export default function ShopPage() {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadProducts() {
            try {
                let response = await fetch(`${apiUrl}/api/products/public`)

                if (!response.ok) {
                    response = await fetch(`${apiUrl}/api/shop`)
                }

                if (!response.ok) {
                    throw new Error('No product endpoint ready yet')
                }

                const data = await response.json()
                setItems(Array.isArray(data) ? data : fallbackItems)
            } catch {
                setItems(fallbackItems)
            } finally {
                setLoading(false)
            }
        }

        loadProducts()
    }, [apiUrl])

    return (
        <section className="mx-auto max-w-7xl px-6 py-14">
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-slate-500">Scout Shop</p>
            <h1 className="mt-3 text-4xl font-extrabold">Scarfs, woggles, badges, uniform, and gear</h1>
            <p className="mt-3 max-w-3xl text-slate-600">
                This public shop page already works with your current backend fallback, and in the next step we’ll switch it to full admin-managed products.
            </p>

            {loading ? (
                <p className="mt-8 text-lg font-semibold text-slate-600">Loading shop...</p>
            ) : (
                <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {items.map((item) => (
                        <article key={item.id} className="overflow-hidden rounded-[28px] bg-white shadow-sm">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="h-64 w-full object-cover"
                            />
                            <div className="p-6">
                                <p className="text-sm font-bold uppercase tracking-wide text-slate-500">{item.category}</p>
                                <h3 className="mt-2 text-2xl font-extrabold">{item.name}</h3>
                                <p className="mt-3 leading-7 text-slate-600">{item.description}</p>
                                <div className="mt-5 flex items-center justify-between">
                                    <span className="text-xl font-extrabold text-[#0d7a52]">KSh {item.price}</span>
                                    <a 
                                        href={`https://wa.me/254700000000?text=${encodeURIComponent(`Hi, I am interested in ordering the ${item.name} for KSh ${item.price}`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rounded-full bg-slate-900 px-5 py-3 font-bold text-white hover:bg-slate-800 transition-colors"
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