export const instant = false;

import { connection } from 'next/server';
import { Navbar } from '@/components/layout/navbar';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await connection();
  return (
    <>
      <Navbar />
      <main className="relative mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {/* Ambient glow orbs */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute -left-32 top-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-indigo-500/5 to-purple-500/3 blur-[150px] animate-float" />
          <div className="absolute -right-32 bottom-1/3 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-blue-500/4 to-cyan-500/3 blur-[150px] animate-float" style={{ animationDelay: '2s' }} />
        </div>
        <div className="relative z-10">{children}</div>
      </main>
    </>
  );
}
