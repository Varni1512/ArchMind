import React from 'react';
import { Code, MessageSquare, PlayCircle } from 'lucide-react';

export function BottomActionBar() {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-surface border border-primary/10 rounded-full shadow-lg px-2 py-2 flex items-center gap-2 z-20">
      <button disabled className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-primary/5 transition-colors opacity-50 cursor-not-allowed group">
        <Code size={18} className="text-primary/70 group-hover:text-primary-ink" />
        <span className="text-sm font-medium text-primary/70 group-hover:text-primary-ink">Generate Code</span>
      </button>
      
      <div className="w-px h-6 bg-primary/10"></div>
      
      <button disabled className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-primary/5 transition-colors opacity-50 cursor-not-allowed group">
        <MessageSquare size={18} className="text-primary/70 group-hover:text-primary-ink" />
        <span className="text-sm font-medium text-primary/70 group-hover:text-primary-ink">Explain Design</span>
      </button>

      <div className="w-px h-6 bg-primary/10"></div>
      
      <button disabled className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-ink text-surface hover:bg-primary transition-colors opacity-50 cursor-not-allowed group">
        <PlayCircle size={18} />
        <span className="text-sm font-medium">Interview Mode</span>
      </button>
    </div>
  );
}
