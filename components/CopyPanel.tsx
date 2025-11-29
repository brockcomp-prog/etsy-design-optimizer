
import React, { useState } from 'react';
import type { CopyResult } from '../types';
import { CopyIcon, CheckIcon } from './icons';

interface CopyPanelProps {
  copyResult: CopyResult | null;
  isGenerating: boolean;
}

const CopyBlock: React.FC<{ title: string; content: string }> = ({ title, content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-gray-50 p-3 rounded-md">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-gray-600">{title}</h4>
        <button onClick={handleCopy} className="text-gray-400 hover:text-indigo-600 transition-colors" aria-label={`Copy ${title}`}>
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>
      <div className="text-sm">
        <p className="text-gray-700 whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
};

const ClickToCopyPill: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className="relative inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-colors"
      aria-label={`Copy tag: ${text}`}
    >
      {text}
      {copied && (
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 pointer-events-none">
          Copied!
        </span>
      )}
    </button>
  );
};

const SkeletonCopyPanel: React.FC = () => (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6 sticky top-6 animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-50 p-3 rounded-md space-y-2">
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
        ))}
      </div>
    </div>
);

export const CopyPanel: React.FC<CopyPanelProps> = ({ copyResult, isGenerating }) => {
  
  if (isGenerating && !copyResult) {
      return <SkeletonCopyPanel />;
  }
  
  if (!copyResult) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col justify-center items-center text-center sticky top-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 text-gray-300 mb-4">
            <path d="M17 6.1H3"/>
            <path d="M21 12.1H3"/>
            <path d="M15.1 18.1H3"/>
        </svg>
        <h3 className="text-lg font-semibold text-gray-800">Generated Copy</h3>
        <p className="text-gray-500 mt-1">Your generated title, description, and tags will appear here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6 sticky top-6">
      <h2 className="text-xl font-semibold text-gray-800">Generated Listing Copy</h2>
      <div className="space-y-4">
        <CopyBlock title="Title" content={copyResult.title} />
        <CopyBlock title="Description" content={copyResult.description} />
        
        <div className="bg-gray-50 p-3 rounded-md">
          <h4 className="font-semibold text-gray-600 mb-2">13 Etsy Tags</h4>
          <div className="flex flex-wrap">
            {copyResult.tags.map((tag) => <ClickToCopyPill key={tag} text={tag} />)}
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-md">
          <h4 className="font-semibold text-gray-600 mb-2">Materials</h4>
          <div className="flex flex-wrap">
            {copyResult.materials.map((material) => (
              <ClickToCopyPill key={material} text={material} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
