'use client';

// PDF upload dropzone — lets user drag-and-drop or click to select a PDF.
// On upload, sends it to the API which extracts text and saves it.

import { useCallback, useState } from 'react';

interface CVUploadProps {
  onUploadComplete: () => void;
}

export function CVUpload({ onUploadComplete }: CVUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = useCallback(async (file: File) => {
    setError('');
    setUploading(true);

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      setUploading(false);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File too large (max 5MB)');
      setUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/cv', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Upload failed');
      } else {
        onUploadComplete();
      }
    } catch {
      setError('Network error — please try again');
    } finally {
      setUploading(false);
    }
  }, [onUploadComplete]);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          dragOver
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50'
        }`}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="absolute inset-0 cursor-pointer opacity-0"
          disabled={uploading}
        />
        <div className="space-y-2">
          <div className="text-4xl">
            {uploading ? '...' : '+'}
          </div>
          <p className="text-sm font-medium">
            {uploading ? 'Extracting text from PDF...' : 'Drop your CV here or click to browse'}
          </p>
          <p className="text-xs text-muted-foreground">PDF only, max 5MB</p>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
