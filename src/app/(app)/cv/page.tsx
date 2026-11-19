'use client';

// CV page — upload a PDF, see extracted text, edit it, save.
// Shows upload dropzone when no CV exists, editor when one does.

import { useCallback, useEffect, useState } from 'react';
import { CVUpload } from '@/components/cv/cv-upload';
import { CVEditor } from '@/components/cv/cv-editor';
import type { CV } from '@/types/database';

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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My CV</h1>
        <p className="text-muted-foreground">
          Upload your CV once — it will be used for all job analyses.
        </p>
      </div>

      {loading && (
        <div className="rounded-lg border border-border p-12 text-center text-muted-foreground">
          Loading your CV...
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Always show upload — user can replace their CV */}
          <CVUpload onUploadComplete={fetchCV} />

          {cv ? (
            <CVEditor
              initialText={cv.raw_text}
              fileName={cv.file_name}
              onSaved={fetchCV}
            />
          ) : (
            <div className="rounded-lg border border-border p-8 text-center text-muted-foreground">
              <p>No CV uploaded yet.</p>
              <p className="mt-1 text-sm">
                Upload a PDF above, or paste your CV text below and save it.
              </p>
              {/* Allow manual text entry without a PDF */}
              <CVEditor
                initialText=""
                fileName="manual-entry.txt"
                onSaved={fetchCV}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
