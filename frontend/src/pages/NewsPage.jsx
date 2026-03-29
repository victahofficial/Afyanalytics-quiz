import { useEffect } from 'react'

export default function NewsPage() {
    useEffect(() => {
        // Load the Twitter embedded timeline widget
        const script = document.createElement('script')
        script.src = 'https://platform.twitter.com/widgets.js'
        script.async = true
        script.charset = 'utf-8'
        document.body.appendChild(script)
        
        return () => {
            if (document.body.contains(script)) {
                // optional cleanup
                document.body.removeChild(script)
            }
        }
    }, [])

    return (
        <section className="mx-auto max-w-7xl px-6 py-14">
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-slate-500">Latest Updates</p>
            <h1 className="mt-3 text-4xl font-extrabold">Social Media News</h1>
            <p className="mt-3 max-w-3xl text-slate-600 mb-10">
                Stay connected with the latest updates from our social channels.
            </p>

            <div className="flex justify-center bg-white p-6 rounded-3xl shadow-sm min-h-[600px] w-full max-w-3xl mx-auto overflow-hidden">
                <a 
                    className="twitter-timeline" 
                    data-theme="light" 
                    data-height="800"
                    href="https://twitter.com/worldscouting?ref_src=twsrc%5Etfw"
                >
                    Tweets by worldscouting
                </a>
            </div>
        </section>
    )
}