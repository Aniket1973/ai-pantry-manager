import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16 lg:px-8">
        <div className="rounded-[2rem] bg-white px-8 py-12 shadow-2xl shadow-slate-200/60 ring-1 ring-slate-100 sm:px-12">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">AI Pantry Manager</p>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                Manage your pantry, reduce waste, and get recipe suggestions.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Sign up to add pantry items, track expiry and low stock, and generate AI-powered meal ideas from what you already have.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/signup" className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
                  Create account
                </Link>
                <Link href="/signin" className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-6 py-3 text-sm text-slate-900 transition hover:bg-slate-100">
                  Sign in
                </Link>
              </div>
            </div>
            <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl shadow-slate-900/20">
              <h2 className="text-2xl font-semibold">Built for home cooks</h2>
              <div className="mt-6 space-y-4 text-sm text-slate-300">
                <p>• Keep your pantry organized with categories, expiry tracking, and stock alerts.</p>
                <p>• Add, edit, and remove items securely for your account only.</p>
                <p>• Generate recipe ideas using AI from the ingredients you already own.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
