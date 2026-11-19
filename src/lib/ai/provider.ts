// AI Provider Interface — the Strategy Pattern.
// This defines WHAT any AI provider must do, not HOW.
// To add a new provider (e.g. Groq), create a new file that implements this interface.

import type { AnalysisResponse } from '@/lib/validators/analysis';

export interface AIProvider {
  analyze(cvText: string, jobDescription: string): Promise<AnalysisResponse>;
}
