import { AuthForm } from '@/components/auth/auth-form';

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      {/* Premium animated gradient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-indigo-500/15 to-purple-500/10 blur-[120px] animate-float" />
        <div className="absolute -right-40 bottom-1/4 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/5 blur-[120px] animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[300px] w-[600px] rounded-full bg-gradient-to-b from-primary/8 to-transparent blur-[100px]" />
      </div>
      <AuthForm />
    </main>
  );
}
