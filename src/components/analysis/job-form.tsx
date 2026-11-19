'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Building2, MapPin, Link as LinkIcon, FileText, AlertTriangle, RotateCcw } from 'lucide-react';
import { JarvisLoader } from '@/components/ui/jarvis-loader';

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

      router.push(`/analyze/${data.analysis.id}`);
    } catch {
      setError('Network error — please try again');
      setLoading(false);
    }
  }

  const inputClass =
    'w-full rounded-xl input-premium px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none';

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loader"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <JarvisLoader message="AI is analyzing your match..." size={220} />
          <motion.p
            className="mt-6 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Comparing skills, experience, and keywords...
          </motion.p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="title" className="mb-2 block text-sm font-medium text-foreground/80">
                Job Title *
              </label>
              <div className="relative">
                <Sparkles className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="title"
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                  required
                  placeholder="e.g. Senior Frontend Engineer"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
            <div>
              <label htmlFor="company" className="mb-2 block text-sm font-medium text-foreground/80">
                Company *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="company"
                  value={form.company}
                  onChange={(e) => update('company', e.target.value)}
                  required
                  placeholder="e.g. Acme Corp"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="location" className="mb-2 block text-sm font-medium text-foreground/80">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="location"
                  value={form.location}
                  onChange={(e) => update('location', e.target.value)}
                  placeholder="e.g. Remote, New York"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
            <div>
              <label htmlFor="url" className="mb-2 block text-sm font-medium text-foreground/80">
                Job URL (optional)
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="url"
                  value={form.url}
                  onChange={(e) => update('url', e.target.value)}
                  placeholder="https://..."
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-medium text-foreground/80">
              Job Description *
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                required
                rows={12}
                placeholder="Paste the full job description here..."
                className={`${inputClass} pl-10`}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {form.description.length} characters (minimum 50)
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="error-card p-5"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
                  <AlertTriangle className="h-4.5 w-4.5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-red-500">Analysis Failed</p>
                  <p className="mt-1 text-sm text-red-400">{error}</p>
                  <button
                    type="button"
                    onClick={() => { setError(''); }}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-300 transition-colors"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Dismiss and try again
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
          >
            <Sparkles className="h-4 w-4" />
            Analyze Match
          </motion.button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
