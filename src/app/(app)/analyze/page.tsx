'use client';

import { JobForm } from '@/components/analysis/job-form';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function AnalyzePage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-primary" />
          Analyze Job
        </h1>
        <p className="mt-1 text-muted-foreground">
          Paste a job description to see how well your CV matches.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <JobForm />
      </motion.div>
    </div>
  );
}
