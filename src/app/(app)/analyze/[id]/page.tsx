// Analysis results page — shows the full AI analysis for a specific job.
// This is a server component that fetches data, then renders client components.

import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AnalysisResults } from '@/components/analysis/analysis-results';

export const instant = false;

export default async function AnalysisResultPage(
  props: PageProps<'/analyze/[id]'>
) {
  const { id } = await props.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  // Fetch the analysis with its related job
  const { data: analysis } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!analysis) {
    notFound();
  }

  const { data: job } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', analysis.job_id)
    .single();

  if (!job) {
    notFound();
  }

  return <AnalysisResults analysis={analysis} job={job} />;
}
