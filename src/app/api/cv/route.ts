// CV API Route
// GET  /api/cv — fetch the user's saved CV
// POST /api/cv — upload a PDF file, extract text, save it
// PUT  /api/cv — update the CV text (after manual editing)

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { extractPdfText } from '@/lib/pdf';
import { cvTextSchema } from '@/lib/validators/cv';

// Fetch the user's current CV
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: cv, error } = await supabase
    .from('cvs')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ cv });
}

// Upload a new PDF CV — extracts text and saves it
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  if (file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Only PDF files are accepted' }, { status: 400 });
  }

  // 5MB limit
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
  }

  let rawText: string;
  try {
    const buffer = await file.arrayBuffer();
    rawText = await extractPdfText(buffer);
  } catch {
    return NextResponse.json(
      { error: 'Could not extract text from this PDF. Make sure it contains selectable text, not just images.' },
      { status: 422 }
    );
  }

  if (rawText.length < 50) {
    return NextResponse.json(
      { error: 'Very little text found in this PDF. It may be scanned/image-based. Please paste your CV text manually.' },
      { status: 422 }
    );
  }

  // Upsert: delete old CV, insert new one (one active CV per user)
  await supabase.from('cvs').delete().eq('user_id', user.id);

  const { data: cv, error } = await supabase
    .from('cvs')
    .insert({
      user_id: user.id,
      file_name: file.name,
      raw_text: rawText,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ cv });
}

// Update CV text (after manual editing in the textarea)
export async function PUT(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = cvTextSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  // Find the user's existing CV
  const { data: existing } = await supabase
    .from('cvs')
    .select('id')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!existing) {
    // No CV exists yet — create one with a placeholder file name
    const { data: cv, error } = await supabase
      .from('cvs')
      .insert({
        user_id: user.id,
        file_name: 'manual-entry.txt',
        raw_text: parsed.data.raw_text,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ cv });
  }

  // Update existing CV
  const { data: cv, error } = await supabase
    .from('cvs')
    .update({ raw_text: parsed.data.raw_text })
    .eq('id', existing.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ cv });
}
