'use client';

// Job analysis form — user enters job details, submits for AI analysis.

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function JobForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    url: '',
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Analysis failed');
        setLoading(false);
        return;
      }

      // Navigate to the results page
      router.push(`/analyze/${data.analysis.id}`);
    } catch {
      setError('Network error — please try again');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1.5">
            Job Title *
          </label>
          <input
            id="title"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            required
            placeholder="e.g. Senior Frontend Engineer"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium mb-1.5">
            Company *
          </label>
          <input
            id="company"
            value={form.company}
            onChange={(e) => update('company', e.target.value)}
            required
            placeholder="e.g. Acme Corp"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-1.5">
            Location
          </label>
          <input
            id="location"
            value={form.location}
            onChange={(e) => update('location', e.target.value)}
            placeholder="e.g. Remote, New York"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div>
          <label htmlFor="url" className="block text-sm font-medium mb-1.5">
            Job URL (optional)
          </label>
          <input
            id="url"
            value={form.url}
            onChange={(e) => update('url', e.target.value)}
            placeholder="https://..."
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1.5">
          Job Description *
        </label>
        <textarea
          id="description"
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          required
          rows={12}
          placeholder="Paste the full job description here..."
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {form.description.length} characters (minimum 50)
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 sm:w-auto"
      >
        {loading ? 'Analyzing... (this takes ~15 seconds)' : 'Analyze Match'}
      </button>
    </form>
  );
}
