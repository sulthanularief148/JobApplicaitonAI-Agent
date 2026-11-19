'use client';

import { useCallback, useEffect, useState } from 'react';
import { CVUpload } from '@/components/cv/cv-upload';
import { CVEditor } from '@/components/cv/cv-editor';
import type { CV } from '@/types/database';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { JarvisLoader } from '@/components/ui/jarvis-loader';

export default function CVPage() {
  const [cv, setCv] = useState<CV | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCV = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/cv');
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to load CV');
      } else {
        setCv(data.cv);
      }
    } catch {
      setError('Network error — please try again');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCV();
  }, [fetchCV]);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-7 w-7 text-primary" />
          My CV
        </h1>
        <p className="mt-1 text-muted-foreground">
          Upload your CV once — it will be used for all job analyses.
        </p>
      </motion.div>

      {loading && (
        <div className="flex justify-center py-16">
          <JarvisLoader message="Loading your CV..." size={120} />
        </div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500"
        >
          {error}
        </motion.div>
      )}

      {!loading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <CVUpload onUploadComplete={fetchCV} />

          {cv ? (
            <CVEditor
              initialText={cv.raw_text}
              fileName={cv.file_name}
              onSaved={fetchCV}
            />
          ) : (
            <div className="glass-card rounded-xl p-10 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <FileText className="h-7 w-7 text-primary" />
              </div>
              <p className="font-medium">No CV uploaded yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Upload a PDF above, or paste your CV text below and save it.
              </p>
              <div className="mt-6">
                <CVEditor
                  initialText=""
                  fileName="manual-entry.txt"
                  onSaved={fetchCV}
                />
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
