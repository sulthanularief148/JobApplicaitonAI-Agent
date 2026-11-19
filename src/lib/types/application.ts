export const APPLICATION_STATUSES = [
  'saved',
  'applied',
  'interview',
  'offer',
  'rejected',
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  saved: 'Saved',
  applied: 'Applied',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
};

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  saved: 'bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-400',
  applied: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
  interview:
    'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400',
  offer: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400',
  rejected: 'bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400',
};

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
  match_score?: number | null;
}
