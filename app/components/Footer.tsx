export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-6 text-center text-sm text-slate-600">
      <p>Built by Your Name</p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500">
        <a href="#" className="hover:text-slate-900">GitHub</a>
        <span>·</span>
        <a href="#" className="hover:text-slate-900">LinkedIn</a>
      </div>
    </footer>
  );
}
