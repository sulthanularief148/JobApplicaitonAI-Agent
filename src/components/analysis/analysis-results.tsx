'use client';

// Full analysis results layout — combines score gauge, skills, and text blocks.

import type { Analysis, Job, ScoreBreakdown } from '@/types/database';
import { ScoreGauge } from './score-gauge';
import { SkillsChips } from './skills-chips';
import { ResultCard } from './result-card';

interface AnalysisResultsProps {
  analysis: Analysis;
  job: Job;
}

export function AnalysisResults({ analysis, job }: AnalysisResultsProps) {
  const breakdown = analysis.score_breakdown as ScoreBreakdown;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {job.title} at {job.company}
        </h1>
        {job.location && (
          <p className="text-muted-foreground">{job.location}</p>
        )}
      </div>

      {/* Score section */}
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <ScoreGauge score={analysis.match_score} />
        <div className="flex-1 space-y-3">
          <h2 className="text-lg font-semibold">Score Breakdown</h2>
          <div className="space-y-2">
            {[
              { label: 'Skills Match', value: breakdown.skills },
              { label: 'Experience Match', value: breakdown.experience },
              { label: 'Keywords Match', value: breakdown.keywords },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="w-36 text-sm text-muted-foreground">{label}</span>
                <div className="flex-1 rounded-full bg-muted h-2.5">
                  <div
                    className="h-2.5 rounded-full bg-primary transition-all duration-700"
                    style={{ width: `${value}%` }}
                  />
                </div>
                <span className="w-8 text-right text-sm font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills */}
      <SkillsChips
        matched={analysis.matched_skills}
        missing={analysis.missing_skills}
      />

      {/* Keywords to add */}
      {analysis.keywords_to_add.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-medium">Keywords to Add to Your CV</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.keywords_to_add.map((kw) => (
              <span
                key={kw}
                className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Text results with copy buttons */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ResultCard title="Tailored Summary" content={analysis.tailored_summary} />
        <ResultCard
          title="Tailored CV Bullets"
          content={analysis.tailored_bullets.map((b) => `• ${b}`).join('\n')}
        />
        <ResultCard title="Cover Note" content={analysis.cover_note} />
        <ResultCard title="LinkedIn Message" content={analysis.linkedin_message} />
      </div>

      {/* Honesty notes */}
      {analysis.honesty_notes.length > 0 && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950">
          <h3 className="mb-2 text-sm font-medium text-yellow-800 dark:text-yellow-400">
            Honesty Notes — Gaps You Should Not Fake
          </h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-yellow-700 dark:text-yellow-400/80">
            {analysis.honesty_notes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
