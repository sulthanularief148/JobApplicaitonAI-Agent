import { AuthForm } from '@/components/auth/auth-form';

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      {/* Ambient glow orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-primary/5 blur-[120px]" />
      </div>
      <AuthForm />
    </main>
  );
}
