import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import {
  Briefcase,
  Send,
  MessageSquare,
  Trophy,
  TrendingUp,
  FileText,
  ArrowRight,
} from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [appsResult, analysesResult, cvResult] = await Promise.all([
    supabase
      .from('applications')
      .select('status')
      .eq('user_id', user!.id),
    supabase
      .from('analyses')
      .select('match_score')
      .eq('user_id', user!.id),
    supabase
      .from('cvs')
      .select('id')
      .eq('user_id', user!.id)
      .limit(1)
      .maybeSingle(),
  ]);

  const apps = appsResult.data ?? [];
  const analyses = analysesResult.data ?? [];
  const hasCV = !!cvResult.data;

  const totalApps = apps.length;
  const applied = apps.filter((a) => a.status === 'applied').length;
  const interviews = apps.filter((a) => a.status === 'interview').length;
  const offers = apps.filter((a) => a.status === 'offer').length;
  const avgScore =
    analyses.length > 0
      ? Math.round(
          analyses.reduce((sum, a) => sum + a.match_score, 0) / analyses.length
        )
      : null;

  const stats = [
    {
      label: 'Total Applications',
      value: totalApps,
      icon: Briefcase,
      color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/50',
    },
    {
      label: 'Applied',
      value: applied,
      icon: Send,
      color:
        'text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/50',
    },
    {
      label: 'Interviews',
      value: interviews,
      icon: MessageSquare,
      color:
        'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/50',
    },
    {
      label: 'Offers',
      value: offers,
      icon: Trophy,
      color:
        'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/50',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back{user?.email ? `, ${user.email}` : ''}!
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-lg border border-border bg-card p-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{label}</p>
              <div className={`rounded-lg p-2 ${color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {avgScore !== null && (
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold">Average Match Score</h2>
          </div>
          <div className="mt-4 flex items-end gap-3">
            <span
              className={`text-5xl font-bold ${
                avgScore >= 70
                  ? 'text-green-600'
                  : avgScore >= 40
                    ? 'text-yellow-600'
                    : 'text-red-600'
              }`}
            >
              {avgScore}%
            </span>
            <span className="mb-1 text-sm text-muted-foreground">
              across {analyses.length} analysis{analyses.length !== 1 ? 'es' : ''}
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full ${
                avgScore >= 70
                  ? 'bg-green-500'
                  : avgScore >= 40
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
              }`}
              style={{ width: `${avgScore}%` }}
            />
          </div>
        </div>
      )}

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="font-semibold">Quick Actions</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {!hasCV && (
            <Link
              href="/cv"
              className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">Upload CV</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          )}
          <Link
            href="/analyze"
            className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted"
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Analyze a Job</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
          <Link
            href="/applications"
            className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted"
          >
            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">View Applications</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </div>
  );
}
