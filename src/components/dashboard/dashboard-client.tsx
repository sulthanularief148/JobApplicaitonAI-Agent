'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Send,
  MessageSquare,
  Trophy,
  TrendingUp,
  FileText,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { GlassCard, StaggerContainer, StaggerItem } from '@/components/ui/motion';

interface DashboardClientProps {
  email?: string;
  totalApps: number;
  applied: number;
  interviews: number;
  offers: number;
  avgScore: number | null;
  analysisCount: number;
  hasCV: boolean;
}

export function DashboardClient({
  email,
  totalApps,
  applied,
  interviews,
  offers,
  avgScore,
  analysisCount,
  hasCV,
}: DashboardClientProps) {
  const stats = [
    {
      label: 'Total Applications',
      value: totalApps,
      icon: Briefcase,
      gradient: 'from-blue-500/20 to-cyan-500/20',
      iconColor: 'text-blue-500',
      border: 'border-blue-500/10',
    },
    {
      label: 'Applied',
      value: applied,
      icon: Send,
      gradient: 'from-indigo-500/20 to-purple-500/20',
      iconColor: 'text-indigo-500',
      border: 'border-indigo-500/10',
    },
    {
      label: 'Interviews',
      value: interviews,
      icon: MessageSquare,
      gradient: 'from-amber-500/20 to-orange-500/20',
      iconColor: 'text-amber-500',
      border: 'border-amber-500/10',
    },
    {
      label: 'Offers',
      value: offers,
      icon: Trophy,
      gradient: 'from-emerald-500/20 to-green-500/20',
      iconColor: 'text-emerald-500',
      border: 'border-emerald-500/10',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back
          {email ? (
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {' '}{email.split('@')[0]}
            </span>
          ) : ''}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s how your job search is going
        </p>
      </motion.div>

      {/* Stats Grid */}
      <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, gradient, iconColor, border }) => (
          <StaggerItem key={label}>
            <GlassCard className={`relative overflow-hidden ${border}`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50`} />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">{label}</p>
                  <div className={`rounded-xl p-2.5 glass-card ${iconColor}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <motion.p
                  className="mt-3 text-4xl font-bold tracking-tight"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
                >
                  {value}
                </motion.p>
              </div>
            </GlassCard>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Average Score */}
      {avgScore !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <GlassCard className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <div className="relative">
              <div className="flex items-center gap-2">
                <div className="rounded-xl bg-primary/10 p-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-semibold">Average Match Score</h2>
              </div>
              <div className="mt-5 flex items-end gap-3">
                <motion.span
                  className={`text-6xl font-bold tracking-tighter ${
                    avgScore >= 70
                      ? 'bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent'
                      : avgScore >= 40
                        ? 'bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent'
                        : 'bg-gradient-to-r from-red-400 to-rose-500 bg-clip-text text-transparent'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {avgScore}%
                </motion.span>
                <span className="mb-2 text-sm text-muted-foreground">
                  across {analysisCount} analysis{analysisCount !== 1 ? 'es' : ''}
                </span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted/50">
                <motion.div
                  className={`h-full rounded-full ${
                    avgScore >= 70
                      ? 'bg-gradient-to-r from-emerald-400 to-green-500'
                      : avgScore >= 40
                        ? 'bg-gradient-to-r from-amber-400 to-yellow-500'
                        : 'bg-gradient-to-r from-red-400 to-rose-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${avgScore}%` }}
                  transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <GlassCard>
          <h2 className="font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Quick Actions
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {!hasCV && (
              <Link href="/cv" className="group">
                <motion.div
                  whileHover={{ y: -2 }}
                  className="flex items-center justify-between rounded-xl border border-glass-border p-4 transition-all duration-300 hover:bg-primary/5 hover:border-primary/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium">Upload CV</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </motion.div>
              </Link>
            )}
            <Link href="/analyze" className="group">
              <motion.div
                whileHover={{ y: -2 }}
                className="flex items-center justify-between rounded-xl border border-glass-border p-4 transition-all duration-300 hover:bg-primary/5 hover:border-primary/20"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Analyze a Job</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </motion.div>
            </Link>
            <Link href="/applications" className="group">
              <motion.div
                whileHover={{ y: -2 }}
                className="flex items-center justify-between rounded-xl border border-glass-border p-4 transition-all duration-300 hover:bg-primary/5 hover:border-primary/20"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium">View Applications</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </motion.div>
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
