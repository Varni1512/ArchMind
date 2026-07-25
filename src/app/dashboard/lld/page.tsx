import React from 'react';
import { GitMerge } from 'lucide-react';

export default function LLDPracticePage() {
  return (
    <div className="h-[calc(100vh-120px)] flex flex-col items-center justify-center text-center bg-surface border border-primary/10 rounded-[24px] p-8">
      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
        <GitMerge size={32} />
      </div>
      <h1 className="font-heading font-extrabold text-3xl text-primary-ink mb-4">LLD Practice</h1>
      <p className="text-primary/70 max-w-md mx-auto">
        This module is currently under development. Soon you will be able to practice object-oriented system design with UML diagrams.
      </p>
    </div>
  );
}
