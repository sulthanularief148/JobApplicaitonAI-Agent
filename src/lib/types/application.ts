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
  saved: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  applied: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  interview:
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  offer: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
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
