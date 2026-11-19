'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, FileText, Check } from 'lucide-react';

interface CVEditorProps {
  initialText: string;
  fileName: string;
  onSaved: () => void;
}

export function CVEditor({ initialText, fileName, onSaved }: CVEditorProps) {
  const [text, setText] = useState(initialText);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const hasChanges = text !== initialText;

  async function handleSave() {
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/cv', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw_text: text, file_name: fileName }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to save');
      } else {
        setMessage('CV saved successfully!');
        onSaved();
      }
    } catch {
      setError('Network error — please try again');
    } finally {
      setSaving(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-1.5">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">{fileName}</p>
            <p className="text-xs text-muted-foreground">Review and edit, then save</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {hasChanges && (
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="text-xs text-amber-500 font-medium"
              >
                Unsaved changes
              </motion.span>
            )}
          </AnimatePresence>
          <motion.button
            onClick={handleSave}
            disabled={saving || !text.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save CV'}
          </motion.button>
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={20}
        className="w-full rounded-xl input-premium px-4 py-3 text-sm font-mono leading-relaxed focus:outline-none"
        placeholder="Your CV text will appear here after uploading a PDF..."
      />

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{text.length.toLocaleString()} characters</span>
        <span>Tip: Make sure all your skills, experience, and education are included</span>
      </div>

      <AnimatePresence>
        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5 text-sm text-emerald-500"
          >
            <Check className="h-4 w-4" />
            {message}
          </motion.p>
        )}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-red-500"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
