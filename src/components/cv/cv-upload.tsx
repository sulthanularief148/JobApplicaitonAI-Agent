'use client';

import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Loader2 } from 'lucide-react';

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
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        whileHover={{ scale: 1.005 }}
        className={`relative overflow-hidden rounded-xl border-2 border-dashed p-10 text-center transition-all duration-300 ${
          dragOver
            ? 'border-primary bg-primary/5 glow-border'
            : 'border-glass-border hover:border-primary/40 hover:bg-primary/5'
        }`}
      >
        {/* Background shimmer */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <input
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="absolute inset-0 cursor-pointer opacity-0"
          disabled={uploading}
        />

        <AnimatePresence mode="wait">
          {uploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <Loader2 className="mx-auto h-10 w-10 text-primary animate-spin" />
              <p className="text-sm font-medium text-primary">Extracting text from PDF...</p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                {dragOver ? (
                  <FileText className="h-7 w-7 text-primary" />
                ) : (
                  <Upload className="h-7 w-7 text-primary" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {dragOver ? 'Drop your CV here' : 'Drop your CV here or click to browse'}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">PDF only, max 5MB</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
