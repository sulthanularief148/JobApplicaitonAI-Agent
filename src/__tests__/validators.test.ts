import { describe, it, expect } from 'vitest';
import { parseAnalysisResponse } from '@/lib/validators/analysis';
import { jobInputSchema } from '@/lib/validators/job';

describe('parseAnalysisResponse', () => {
  const validData = {
    matchScore: 75,
    scoreBreakdown: { skills: 80, experience: 70, keywords: 75 },
    matchedSkills: ['React', 'TypeScript'],
    missingSkills: ['GraphQL'],
    keywordsToAdd: ['CI/CD'],
    tailoredSummary: 'A strong candidate with relevant skills.',
    tailoredBullets: ['Led frontend migration to React'],
    coverNote: 'Dear Hiring Manager, I am excited to apply...',
    linkedinMessage: 'Hi, I noticed your opening for a frontend role.',
    honestyNotes: ['No Docker experience claimed'],
  };

  it('parses valid JSON', () => {
    const result = parseAnalysisResponse(JSON.stringify(validData));
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.matchScore).toBe(75);
      expect(result.data.matchedSkills).toContain('React');
    }
  });

  it('strips markdown code fences', () => {
    const wrapped = '```json\n' + JSON.stringify(validData) + '\n```';
    const result = parseAnalysisResponse(wrapped);
    expect(result.success).toBe(true);
  });

  it('rejects invalid JSON', () => {
    const result = parseAnalysisResponse('not json');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('not valid JSON');
    }
  });

  it('rejects matchScore out of range', () => {
    const result = parseAnalysisResponse(
      JSON.stringify({ ...validData, matchScore: 150 })
    );
    expect(result.success).toBe(false);
  });

  it('rejects empty tailoredBullets', () => {
    const result = parseAnalysisResponse(
      JSON.stringify({ ...validData, tailoredBullets: [] })
    );
    expect(result.success).toBe(false);
  });

  it('rejects linkedinMessage over 280 chars', () => {
    const result = parseAnalysisResponse(
      JSON.stringify({ ...validData, linkedinMessage: 'x'.repeat(281) })
    );
    expect(result.success).toBe(false);
  });
});

describe('jobInputSchema', () => {
  it('validates valid input', () => {
    const result = jobInputSchema.safeParse({
      title: 'Frontend Engineer',
      company: 'Acme Corp',
      description: 'A'.repeat(50),
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty title', () => {
    const result = jobInputSchema.safeParse({
      title: '',
      company: 'Acme',
      description: 'A'.repeat(50),
    });
    expect(result.success).toBe(false);
  });

  it('rejects short description', () => {
    const result = jobInputSchema.safeParse({
      title: 'Dev',
      company: 'Acme',
      description: 'Too short',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid URL', () => {
    const result = jobInputSchema.safeParse({
      title: 'Dev',
      company: 'Acme',
      description: 'A'.repeat(50),
      url: 'not-a-url',
    });
    expect(result.success).toBe(false);
  });

  it('allows empty URL', () => {
    const result = jobInputSchema.safeParse({
      title: 'Dev',
      company: 'Acme',
      description: 'A'.repeat(50),
      url: '',
    });
    expect(result.success).toBe(true);
  });
});
