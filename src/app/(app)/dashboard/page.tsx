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
  Sparkles,
} from 'lucide-react';
import { DashboardClient } from '@/components/dashboard/dashboard-client';

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

  return (
    <DashboardClient
      email={user?.email}
      totalApps={totalApps}
      applied={applied}
      interviews={interviews}
      offers={offers}
      avgScore={avgScore}
      analysisCount={analyses.length}
      hasCV={hasCV}
    />
  );
}
