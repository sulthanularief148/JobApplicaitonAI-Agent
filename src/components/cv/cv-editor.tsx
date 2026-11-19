'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save,
  FileText,
  Check,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Hash,
  AlertCircle,
} from 'lucide-react';

interface CVEditorProps {
  initialText: string;
  fileName: string;
  onSaved: () => void;
}

function detectSections(text: string) {
  const sections: { icon: typeof User; label: string; found: boolean }[] = [
    { icon: User, label: 'Personal Info', found: false },
    { icon: Briefcase, label: 'Experience', found: false },
    { icon: GraduationCap, label: 'Education', found: false },
    { icon: Code, label: 'Skills', found: false },
  ];

  const lower = text.toLowerCase();
  if (/\b(name|email|phone|address|contact)\b/.test(lower)) sections[0].found = true;
  if (/\b(experience|work|employment|position|job)\b/.test(lower)) sections[1].found = true;
  if (/\b(education|university|degree|bachelor|master|school|college)\b/.test(lower)) sections[2].found = true;
  if (/\b(skills|technologies|tools|proficient|competenc|languages)\b/.test(lower)) sections[3].found = true;

  return sections;
}

export function CVEditor({ initialText, fileName, onSaved }: CVEditorProps) {
  const [text, setText] = useState(initialText);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const hasChanges = text !== initialText;
  const sections = detectSections(text);
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

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
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold">{fileName}</p>
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

      {/* Detected sections chips */}
      {text.trim() && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-wrap items-center gap-2"
        >
          <span className="text-xs font-medium text-muted-foreground mr-1">Detected:</span>
          {sections.map(({ icon: Icon, label, found }) => (
            <span
              key={label}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                found
                  ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'border-glass-border bg-muted/30 text-muted-foreground'
              }`}
            >
              <Icon className="h-3 w-3" />
              {label}
              {found ? (
                <Check className="h-3 w-3" />
              ) : (
                <AlertCircle className="h-3 w-3 opacity-50" />
              )}
            </span>
          ))}
        </motion.div>
      )}

      {/* Text editor */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={20}
        className="w-full rounded-xl input-premium px-4 py-3 text-sm font-mono leading-relaxed focus:outline-none"
        placeholder="Your CV text will appear here after uploading a PDF..."
      />

      {/* Footer stats */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Hash className="h-3 w-3" />
            {text.length.toLocaleString()} characters
          </span>
          <span className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {wordCount.toLocaleString()} words
          </span>
        </div>
        <span>Tip: Make sure all your skills, experience, and education are included</span>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="success-card flex items-center gap-2 p-3 text-sm text-emerald-600 dark:text-emerald-400"
          >
            <Check className="h-4 w-4" />
            {message}
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="error-card flex items-center gap-2 p-3 text-sm text-red-500"
          >
            <AlertCircle className="h-4 w-4" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
