// TypeScript types that mirror the Supabase database schema.
// These keep our app type-safe without needing Supabase's auto-generated types.

export type ApplicationStatus = 'saved' | 'applied' | 'interview' | 'offer' | 'rejected';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
}

export interface CV {
  id: string;
  user_id: string;
  file_name: string;
  raw_text: string;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  user_id: string;
  title: string;
  company: string;
  location: string | null;
  description: string;
  url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScoreBreakdown {
  skills: number;
  experience: number;
  keywords: number;
}

export interface Analysis {
  id: string;
  user_id: string;
  job_id: string;
  match_score: number;
  score_breakdown: ScoreBreakdown;
  matched_skills: string[];
  missing_skills: string[];
  keywords_to_add: string[];
  tailored_summary: string;
  tailored_bullets: string[];
  cover_note: string;
  linkedin_message: string;
  honesty_notes: string[];
  created_at: string;
}

export interface Application {
  id: string;
  user_id: string;
  analysis_id: string | null;
  company: string;
  role: string;
  location: string | null;
  status: ApplicationStatus;
  applied_date: string | null;
  follow_up_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AnalysisCount {
  id: string;
  user_id: string;
  date: string;
  count: number;
}
