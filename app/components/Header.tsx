"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const response = await fetch("/api/auth/session", { method: "GET" });
      const data = await response.json();
      setIsAuthenticated(Boolean(data?.user));
    }

    checkAuth();
  }, []);

  return (
    <header className="border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          AI Pantry Manager
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-700">
          {isAuthenticated ? (
            <>
              <Link href="/" className="hover:text-slate-900">Dashboard</Link>
              <button
                type="button"
                onClick={async () => {
                  await fetch("/api/auth", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: "signout" }),
                  });
                  window.location.reload();
                }}
                className="rounded-full bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/signin" className="hover:text-slate-900">Sign in</Link>
              <Link href="/signup" className="rounded-full bg-slate-900 px-4 py-2 text-white hover:bg-slate-700">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
