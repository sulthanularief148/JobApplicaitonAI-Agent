// Database-based rate limiter — max 20 analyses per user per day.
// Stored in the analysis_counts table so limits persist across deploys.

import { SupabaseClient } from '@supabase/supabase-js';

const MAX_ANALYSES_PER_DAY = 20;

export async function checkRateLimit(
  supabase: SupabaseClient,
  userId: string
): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // Get today's count
  const { data: existing } = await supabase
    .from('analysis_counts')
    .select('count')
    .eq('user_id', userId)
    .eq('date', today)
    .maybeSingle();

  const currentCount = existing?.count ?? 0;
  const remaining = Math.max(0, MAX_ANALYSES_PER_DAY - currentCount);

  return {
    allowed: currentCount < MAX_ANALYSES_PER_DAY,
    remaining,
    limit: MAX_ANALYSES_PER_DAY,
  };
}

export async function incrementAnalysisCount(
  supabase: SupabaseClient,
  userId: string
): Promise<void> {
  const today = new Date().toISOString().split('T')[0];

  const { data: existing } = await supabase
    .from('analysis_counts')
    .select('id, count')
    .eq('user_id', userId)
    .eq('date', today)
    .maybeSingle();

  if (existing) {
    await supabase
      .from('analysis_counts')
      .update({ count: existing.count + 1 })
      .eq('id', existing.id);
  } else {
    await supabase.from('analysis_counts').insert({
      user_id: userId,
      date: today,
      count: 1,
    });
  }
}

// Exported for testing
export { MAX_ANALYSES_PER_DAY };
