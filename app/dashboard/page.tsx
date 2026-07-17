import Footer from "../components/Footer";
import Header from "../components/Header";
import PantryManager from "../components/PantryManager";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/50">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Dashboard</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">Your AI pantry overview</h1>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-600">
              View all items, manage expiring goods, and generate recipe ideas from your pantry inventory.
            </p>
          </div>
          <div className="mt-8">
            <PantryManager />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}