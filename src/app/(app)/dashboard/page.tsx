// Dashboard page — placeholder for Phase 5 (stats and charts).
// For now, just confirms that auth is working.

import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back{user?.email ? `, ${user.email}` : ''}!
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Phase 5 will add real stat cards here */}
        {['Total Applications', 'Applied', 'Interviews', 'Avg Match Score'].map(
          (label) => (
            <div
              key={label}
              className="rounded-lg border border-border bg-card p-6"
            >
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-1 text-3xl font-bold">—</p>
            </div>
          )
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        Start by uploading your CV, then analyze a job posting to see your match score.
      </p>
    </div>
  );
}
