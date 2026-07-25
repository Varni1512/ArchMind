import React from 'react';
import { Component } from 'lucide-react';

export default function HLDPracticePage() {
  return (
    <div className="h-[calc(100vh-120px)] flex flex-col items-center justify-center text-center bg-surface border border-primary/10 rounded-[24px] p-8">
      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
        <Component size={32} />
      </div>
      <h1 className="font-heading font-extrabold text-3xl text-primary-ink mb-4">HLD Practice</h1>
      <p className="text-primary/70 max-w-md mx-auto">
        This module is currently under development. Soon you will be able to practice real-world High Level Design questions.
      </p>
    </div>
  );
}
