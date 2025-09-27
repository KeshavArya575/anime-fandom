// components/LoreCard.tsx
import { ReactNode } from 'react';
import { ChevronUpIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

type LoreCardProps = {
  title: string;
  wordCount: number;
  updatedText: string;
  children: ReactNode;
};

export default function LoreCard({ title, wordCount, updatedText, children }: LoreCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between p-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center gap-x-4 text-xs text-gray-500">
          <span>{wordCount} words</span>
          <span>Updated {updatedText}</span>
          <ChevronUpIcon className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      <div className="border-t border-gray-200 p-6">
        {children}
      </div>
    </div>
  );
}

export function CiteSourcesButton() {
  return (
    <div className="mt-4 text-right">
      <button className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
        <PencilSquareIcon className="h-4 w-4 text-gray-500" />
        Cite sources
      </button>
    </div>
  );
}