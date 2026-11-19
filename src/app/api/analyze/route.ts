// POST /api/analyze — the core analysis endpoint.
// Takes job details + user's CV, sends to AI, validates response, saves to DB.

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { jobInputSchema } from '@/lib/validators/job';
import { GeminiProvider } from '@/lib/ai/gemini';
import { checkRateLimit, incrementAnalysisCount } from '@/lib/rate-limit';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parse and validate input
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = jobInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  // Check rate limit
  const rateCheck = await checkRateLimit(supabase, user.id);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        error: `Daily limit reached (${rateCheck.limit} analyses per day). Try again tomorrow.`,
        remaining: 0,
        limit: rateCheck.limit,
      },
      { status: 429 }
    );
  }

  // Fetch the user's CV
  const { data: cv } = await supabase
    .from('cvs')
    .select('raw_text')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!cv) {
    return NextResponse.json(
      { error: 'No CV found. Please upload your CV first.' },
      { status: 400 }
    );
  }

  const { title, company, location, description, url } = parsed.data;

  // Save the job posting
  const { data: job, error: jobError } = await supabase
    .from('jobs')
    .insert({
      user_id: user.id,
      title,
      company,
      location: location || null,
      description,
      url: url || null,
    })
    .select()
    .single();

  if (jobError || !job) {
    return NextResponse.json(
      { error: `Failed to save job: ${jobError?.message}` },
      { status: 500 }
    );
  }

  // Call the AI
  let analysisResult;
  try {
    const provider = new GeminiProvider();
    analysisResult = await provider.analyze(cv.raw_text, description);
  } catch (err) {
    // Clean up the saved job if AI fails
    await supabase.from('jobs').delete().eq('id', job.id);
    const message = err instanceof Error ? err.message : 'AI analysis failed';
    return NextResponse.json({ error: message }, { status: 502 });
  }

  // Save the analysis result
  const { data: analysis, error: analysisError } = await supabase
    .from('analyses')
    .insert({
      user_id: user.id,
      job_id: job.id,
      match_score: analysisResult.matchScore,
      score_breakdown: analysisResult.scoreBreakdown,
      matched_skills: analysisResult.matchedSkills,
      missing_skills: analysisResult.missingSkills,
      keywords_to_add: analysisResult.keywordsToAdd,
      tailored_summary: analysisResult.tailoredSummary,
      tailored_bullets: analysisResult.tailoredBullets,
      cover_note: analysisResult.coverNote,
      linkedin_message: analysisResult.linkedinMessage,
      honesty_notes: analysisResult.honestyNotes,
    })
    .select()
    .single();

  if (analysisError || !analysis) {
    return NextResponse.json(
      { error: `Failed to save analysis: ${analysisError?.message}` },
      { status: 500 }
    );
  }

  // Increment rate limit counter
  await incrementAnalysisCount(supabase, user.id);

  return NextResponse.json({
    analysis: { ...analysis, job },
    remaining: rateCheck.remaining - 1,
  });
}
