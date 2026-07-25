import React from 'react';
import { PenTool } from 'lucide-react';

export default function CanvasPage() {
  return (
    <div className="h-[calc(100vh-120px)] flex flex-col items-center justify-center text-center bg-surface border border-primary/10 rounded-[24px] p-8">
      <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mb-6">
        <PenTool size={32} />
      </div>
      <h1 className="font-heading font-extrabold text-3xl text-primary-ink mb-4">Canvas Coming Next</h1>
      <p className="text-primary/70 max-w-md mx-auto">
        We are building a powerful, Excalidraw-like workspace to let you design anything from scratch. Stay tuned!
      </p>
    </div>
  );
}
