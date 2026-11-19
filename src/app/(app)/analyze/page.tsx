'use client';

// Analyze page — form for pasting a job description.

import { JobForm } from '@/components/analysis/job-form';

export default function AnalyzePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analyze Job</h1>
        <p className="text-muted-foreground">
          Paste a job description to see how well your CV matches.
        </p>
      </div>
      <JobForm />
    </div>
  );
}
