'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, Zap } from 'lucide-react';

type AuthMode = 'login' | 'signup' | 'magic';

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleEmailPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const supabase = createClient();

    if (mode === 'signup') {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Signup failed');
        setLoading(false);
        return;
      }
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setMessage('Account created! You can now log in.');
      } else {
        window.location.href = '/dashboard';
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        window.location.href = '/dashboard';
      }
    }
    setLoading(false);
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Check your email for the magic link!');
    }
    setLoading(false);
  }

  async function handleDemoLogin() {
    setLoading(true);
    setError('');
    setMessage('');

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: process.env.NEXT_PUBLIC_DEMO_EMAIL || 'demo@applywise.example',
      password: process.env.NEXT_PUBLIC_DEMO_PASSWORD || 'demo-password-change-me',
    });

    if (error) {
      setError('Demo login failed. Please sign up with email/password instead.');
    } else {
      window.location.href = '/dashboard';
    }
    setLoading(false);
  }

  const inputClass =
    'w-full rounded-xl input-premium px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none';

  return (
    <div className="w-full max-w-md">
      {/* Logo & Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 text-center"
      >
        <motion.div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10"
          animate={{ boxShadow: ['0 0 20px var(--glow)', '0 0 40px var(--glow)', '0 0 20px var(--glow)'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Sparkles className="h-8 w-8 text-primary" />
        </motion.div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
          ApplyWise AI
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          AI-powered job application assistant
        </p>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="glass-card rounded-2xl p-8 glow-border"
      >
        {/* Mode tabs */}
        <div className="mb-6 flex gap-1 rounded-xl bg-muted/50 p-1">
          {(['login', 'signup', 'magic'] as AuthMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`relative flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ${
                mode === m ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="relative z-10">
                {m === 'login' ? 'Log In' : m === 'signup' ? 'Sign Up' : 'Magic Link'}
              </span>
              {mode === m && (
                <motion.div
                  layoutId="auth-tab"
                  className="absolute inset-0 rounded-lg bg-background shadow-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Email/password form */}
        {(mode === 'login' || mode === 'signup') && (
          <motion.form
            key={mode}
            initial={{ opacity: 0, x: mode === 'signup' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleEmailPassword}
            className="space-y-4"
          >
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground/80">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground/80">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  required
                  minLength={6}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50"
            >
              {loading
                ? 'Loading...'
                : mode === 'signup'
                  ? 'Create Account'
                  : 'Log In'}
            </motion.button>
          </motion.form>
        )}

        {/* Magic link form */}
        {mode === 'magic' && (
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleMagicLink}
            className="space-y-4"
          >
            <div>
              <label htmlFor="magic-email" className="mb-2 block text-sm font-medium text-foreground/80">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="magic-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Magic Link'}
            </motion.button>
          </motion.form>
        )}

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-glass-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-transparent px-3 text-muted-foreground backdrop-blur-sm">or</span>
          </div>
        </div>

        {/* Demo login */}
        <motion.button
          onClick={handleDemoLogin}
          disabled={loading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-glass-border bg-muted/30 px-4 py-3 text-sm font-medium hover:bg-muted/50 transition-all duration-300 disabled:opacity-50"
        >
          <Zap className="h-4 w-4 text-primary" />
          Try Demo (No Sign-Up Needed)
        </motion.button>

        {/* Feedback messages */}
        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-sm text-center text-green-500"
          >
            {message}
          </motion.p>
        )}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-sm text-center text-red-500"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
