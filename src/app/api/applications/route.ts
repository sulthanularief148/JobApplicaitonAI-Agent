import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('applications')
    .select('*, analyses(match_score)')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const applications = (data ?? []).map((app) => ({
    ...app,
    match_score: app.analyses?.match_score ?? null,
    analyses: undefined,
  }));

  return NextResponse.json({ applications });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: {
    company?: string;
    role?: string;
    location?: string;
    status?: string;
    notes?: string;
    applied_date?: string;
    follow_up_date?: string;
    analysis_id?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.company || !body.role) {
    return NextResponse.json(
      { error: 'Company and role are required' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('applications')
    .insert({
      user_id: user.id,
      company: body.company,
      role: body.role,
      location: body.location || null,
      status: body.status || 'saved',
      notes: body.notes || null,
      applied_date: body.applied_date || null,
      follow_up_date: body.follow_up_date || null,
      analysis_id: body.analysis_id || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ application: data }, { status: 201 });
}
