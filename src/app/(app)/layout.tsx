// Authenticated layout — wraps all pages behind the navbar.
// Using a route group "(app)" so /dashboard, /cv, /analyze, /applications
// all share this layout without adding "(app)" to the URL.

// Allow blocking render — all auth pages need cookies for the user session
export const instant = false;

import { Navbar } from '@/components/layout/navbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        {children}
      </main>
    </>
  );
}
