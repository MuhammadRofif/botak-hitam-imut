/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export function parseInline(text: string): React.ReactNode[] {
  // Regex to match **bold**, *italic*, _italic_, `code`
  const regex = /(\*\*.*?\*\*|\*.*?\*|_.*?_|`.*?`)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-sans font-black text-slate-800">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={index} className="italic text-slate-700">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith('_') && part.endsWith('_')) {
      return (
        <em key={index} className="italic text-slate-700">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={index}
          className="bg-slate-100/90 text-pink-600 px-1.5 py-0.5 rounded-lg border border-slate-200 font-mono text-[10px]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  // Split by newlines
  const rawLines = content.split(/\r?\n/);

  return (
    <div className="space-y-1.5 text-xs text-slate-600 leading-relaxed font-sans">
      {rawLines.map((line, idx) => {
        const trimmed = line.trim();
        if (trimmed === '') {
          return <div key={idx} className="h-2" />;
        }

        // Heading 1
        if (trimmed.startsWith('# ')) {
          return (
            <h2 key={idx} className="text-sm font-sans font-black text-slate-800 mt-4 mb-1.5 flex items-center gap-1">
              {parseInline(trimmed.slice(2))}
            </h2>
          );
        }
        // Heading 2
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={idx} className="text-xs font-sans font-black text-slate-750 mt-3 mb-1 flex items-center gap-1">
              {parseInline(trimmed.slice(3))}
            </h3>
          );
        }
        // Heading 3
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="text-[11px] font-sans font-black text-slate-700 mt-2 mb-0.5 flex items-center gap-1">
              {parseInline(trimmed.slice(4))}
            </h4>
          );
        }

        // Bullet list item
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('+ ')) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-3 py-0.5">
              <span className="text-pink-400 font-extrabold select-none mt-0.5">•</span>
              <span className="flex-1 text-slate-750">{parseInline(trimmed.slice(2))}</span>
            </div>
          );
        }

        // Numbered list item
        const numMatch = trimmed.match(/^(\d+)\.\s(.*)/);
        if (numMatch) {
          const num = numMatch[1];
          const rest = numMatch[2];
          return (
            <div key={idx} className="flex items-start gap-2 pl-3 py-0.5">
              <span className="text-indigo-500 font-sans font-black select-none shrink-0">{num}.</span>
              <span className="flex-1 text-slate-750">{parseInline(rest)}</span>
            </div>
          );
        }

        // Normal text line
        return (
          <p key={idx} className="min-h-[1em] text-slate-650">
            {parseInline(line)}
          </p>
        );
      })}
    </div>
  );
}
