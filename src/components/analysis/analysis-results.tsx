'use client';

import type { Analysis, Job, ScoreBreakdown } from '@/types/database';
import { ScoreGauge } from './score-gauge';
import { SkillsChips } from './skills-chips';
import { ResultCard } from './result-card';
import { motion } from 'framer-motion';
import { FadeIn, StaggerContainer, StaggerItem, GlassCard } from '@/components/ui/motion';

interface AnalysisResultsProps {
  analysis: Analysis;
  job: Job;
}

export function AnalysisResults({ analysis, job }: AnalysisResultsProps) {
  const breakdown = analysis.score_breakdown as ScoreBreakdown;

  return (
    <div className="space-y-8">
      {/* Header */}
      <FadeIn>
        <h1 className="text-3xl font-bold tracking-tight">
          {job.title}
          <span className="text-muted-foreground font-normal"> at </span>
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {job.company}
          </span>
        </h1>
        {job.location && (
          <p className="mt-1 text-muted-foreground">{job.location}</p>
        )}
      </FadeIn>

      {/* Score section */}
      <FadeIn delay={0.1}>
        <GlassCard className="relative overflow-hidden" hover={false}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
          <div className="relative flex flex-col items-center gap-8 sm:flex-row sm:items-start">
            <ScoreGauge score={analysis.match_score} />
            <div className="flex-1 space-y-4">
              <h2 className="text-lg font-semibold">Score Breakdown</h2>
              <div className="space-y-3">
                {[
                  { label: 'Skills Match', value: breakdown.skills, color: 'from-blue-400 to-indigo-500' },
                  { label: 'Experience', value: breakdown.experience, color: 'from-emerald-400 to-green-500' },
                  { label: 'Keywords', value: breakdown.keywords, color: 'from-amber-400 to-orange-500' },
                ].map(({ label, value, color }, i) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="w-28 text-sm text-muted-foreground">{label}</span>
                    <div className="flex-1 h-2.5 rounded-full bg-muted/50 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full bg-gradient-to-r ${color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                      />
                    </div>
                    <span className="w-10 text-right text-sm font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      </FadeIn>

      {/* Skills */}
      <FadeIn delay={0.2}>
        <SkillsChips
          matched={analysis.matched_skills}
          missing={analysis.missing_skills}
        />
      </FadeIn>

      {/* Keywords to add */}
      {analysis.keywords_to_add.length > 0 && (
        <FadeIn delay={0.25}>
          <GlassCard hover={false}>
            <h3 className="mb-3 text-sm font-semibold">Keywords to Add to Your CV</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.keywords_to_add.map((kw, i) => (
                <motion.span
                  key={kw}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs font-medium text-primary"
                >
                  + {kw}
                </motion.span>
              ))}
            </div>
          </GlassCard>
        </FadeIn>
      )}

      {/* Text results */}
      <StaggerContainer className="grid gap-4 lg:grid-cols-2" staggerDelay={0.1}>
        <StaggerItem><ResultCard title="Tailored Summary" content={analysis.tailored_summary} /></StaggerItem>
        <StaggerItem>
          <ResultCard
            title="Tailored CV Bullets"
            content={analysis.tailored_bullets.map((b) => `  ${b}`).join('\n')}
          />
        </StaggerItem>
        <StaggerItem><ResultCard title="Cover Note" content={analysis.cover_note} /></StaggerItem>
        <StaggerItem><ResultCard title="LinkedIn Message" content={analysis.linkedin_message} /></StaggerItem>
      </StaggerContainer>

      {/* Honesty notes */}
      {analysis.honesty_notes.length > 0 && (
        <FadeIn delay={0.4}>
          <div className="glass-card rounded-xl p-5 border border-amber-500/20 bg-amber-500/5">
            <h3 className="mb-3 text-sm font-semibold text-amber-500">
              Honesty Notes — Gaps You Should Not Fake
            </h3>
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-amber-600 dark:text-amber-400/80">
              {analysis.honesty_notes.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
