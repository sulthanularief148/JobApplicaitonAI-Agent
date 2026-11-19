// Zod schema for validating the AI's response.
// The AI must return JSON matching this exact shape.
// If it doesn't, we retry once with the validation error, then show a friendly message.

import { z } from 'zod';

export const scoreBreakdownSchema = z.object({
  skills: z.number().min(0).max(100),
  experience: z.number().min(0).max(100),
  keywords: z.number().min(0).max(100),
});

export const analysisResponseSchema = z.object({
  matchScore: z.number().min(0).max(100),
  scoreBreakdown: scoreBreakdownSchema,
  matchedSkills: z.array(z.string()),
  missingSkills: z.array(z.string()),
  keywordsToAdd: z.array(z.string()),
  tailoredSummary: z.string().min(1),
  tailoredBullets: z.array(z.string()).min(1),
  coverNote: z.string().min(1),
  linkedinMessage: z.string().min(1).max(280),
  honestyNotes: z.array(z.string()),
});

export type AnalysisResponse = z.infer<typeof analysisResponseSchema>;

// Validates the raw AI output string, returns parsed data or error details
export function parseAnalysisResponse(raw: string): {
  success: true;
  data: AnalysisResponse;
} | {
  success: false;
  error: string;
} {
  // Strip markdown code fences the AI sometimes wraps around JSON
  let cleaned = raw.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return { success: false, error: 'Response is not valid JSON' };
  }

  const result = analysisResponseSchema.safeParse(parsed);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `${i.path.join('.')}: ${i.message}`)
      .join('; ');
    return { success: false, error: `Invalid response shape: ${issues}` };
  }

  return { success: true, data: result.data };
}
