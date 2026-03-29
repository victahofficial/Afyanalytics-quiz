export default function AdminPlaceholderPage({ title, text }) {
    return (
        <section className="rounded-[32px] bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-extrabold">{title}</h1>
            <p className="mt-3 max-w-2xl leading-7 text-slate-600">{text}</p>
            <div className="mt-8 rounded-[28px] bg-slate-100 p-6 text-sm font-semibold text-slate-600">
                This page shell is ready. In Step 2 we connect it to real CRUD forms, file uploads, and database data.
            </div>
        </section>
    )
}