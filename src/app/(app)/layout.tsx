export const instant = false;

import { Navbar } from '@/components/layout/navbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="relative mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {/* Ambient glow */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute left-1/4 top-1/3 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[150px]" />
          <div className="absolute right-1/4 bottom-1/3 h-[400px] w-[400px] rounded-full bg-primary/3 blur-[150px]" />
        </div>
        <div className="relative z-10">{children}</div>
      </main>
    </>
  );
}
