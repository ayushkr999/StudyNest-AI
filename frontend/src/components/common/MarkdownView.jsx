import React from 'react';
import ReactMarkdown from 'react-markdown';

export const MarkdownView = ({ content, className = '' }) => {
  return (
    <div className={`prose dark:prose-invert max-w-none text-sm leading-relaxed ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-xl font-bold mt-4 mb-2 text-neutral-900 dark:text-neutral-100" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-lg font-semibold mt-3 mb-1.5 text-neutral-900 dark:text-neutral-100" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-base font-semibold mt-2 mb-1 text-neutral-900 dark:text-neutral-100" {...props} />
          ),
          p: ({ node, ...props }) => <p className="mb-2.5 text-neutral-700 dark:text-neutral-300" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-2.5 space-y-1 text-neutral-700 dark:text-neutral-300" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-2.5 space-y-1 text-neutral-700 dark:text-neutral-300" {...props} />,
          li: ({ node, ...props }) => <li className="text-neutral-700 dark:text-neutral-300" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-emerald-500 pl-4 py-1 italic bg-emerald-50/50 dark:bg-emerald-950/20 rounded-r my-2 text-neutral-600 dark:text-neutral-400" {...props} />
          ),
          code: ({ node, inline, ...props }) =>
            inline ? (
              <code className="px-1.5 py-0.5 rounded text-xs bg-neutral-100 dark:bg-neutral-800 text-emerald-600 dark:text-emerald-400 font-mono" {...props} />
            ) : (
              <pre className="p-3 my-2 rounded-lg bg-neutral-900 text-neutral-100 text-xs font-mono overflow-x-auto border border-neutral-800">
                <code {...props} />
              </pre>
            ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-3">
              <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800 border border-neutral-200 dark:border-neutral-800 text-xs" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th className="px-3 py-2 bg-neutral-50 dark:bg-neutral-800 font-semibold text-left text-neutral-700 dark:text-neutral-300" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="px-3 py-2 border-t border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400" {...props} />
          ),
        }}
      >
        {content || ''}
      </ReactMarkdown>
    </div>
  );
};
