'use client';

// Result card — shows a text block with a title, content, and copy button.

import { useState } from 'react';

interface ResultCardProps {
  title: string;
  content: string;
}

export function ResultCard({ title, content }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium">{title}</h3>
        <button
          onClick={handleCopy}
          className="rounded px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <p className="whitespace-pre-wrap text-sm text-foreground/80">{content}</p>
    </div>
  );
}
