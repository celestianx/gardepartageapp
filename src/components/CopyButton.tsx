'use client';
import { useState } from 'react';

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
    >
      {copied ? 'Lien copié !' : 'Copier le lien'}
    </button>
  );
}
