'use client';

// CV text editor — shows the extracted text in a textarea for manual editing.
// User can fix OCR errors or add missing info, then save.

import { useState } from 'react';

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

  // Track if user has made changes
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Extracted from: {fileName}</p>
          <p className="text-xs text-muted-foreground">
            Review and edit the text below, then save
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <span className="text-xs text-muted-foreground">Unsaved changes</span>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !text.trim()}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save CV'}
          </button>
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={20}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        placeholder="Your CV text will appear here after uploading a PDF..."
      />

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{text.length.toLocaleString()} characters</span>
        <span>Tip: Make sure all your skills, experience, and education are included</span>
      </div>

      {message && (
        <p className="text-sm text-green-600 dark:text-green-400">{message}</p>
      )}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
