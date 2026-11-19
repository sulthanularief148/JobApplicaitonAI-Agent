'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { GlassCard } from '@/components/ui/motion';

interface SkillsChipsProps {
  matched: string[];
  missing: string[];
}

export function SkillsChips({ matched, missing }: SkillsChipsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {matched.length > 0 && (
        <GlassCard hover={false}>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <div className="rounded-full bg-emerald-500/10 p-1">
              <Check className="h-3 w-3 text-emerald-500" />
            </div>
            Matched Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {matched.map((skill, i) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </GlassCard>
      )}
      {missing.length > 0 && (
        <GlassCard hover={false}>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <div className="rounded-full bg-red-500/10 p-1">
              <X className="h-3 w-3 text-red-500" />
            </div>
            Missing Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {missing.map((skill, i) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-full bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
