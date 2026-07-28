import React from 'react';
import { ShieldAlert, Code2, Layers, Zap, GitCommit, CheckCircle2 } from 'lucide-react';

export function LLDAssistantPanel() {
  return (
    <div className="w-80 h-full bg-surface border-l border-primary/10 flex flex-col shrink-0">
      <div className="p-4 border-b border-primary/10">
        <h2 className="font-heading font-bold text-lg text-primary-ink">LLD Assistant</h2>
        <p className="text-xs text-primary/60 mt-1">AI-powered design feedback</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Placeholder Cards */}
        <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 opacity-70">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert size={16} className="text-blue-500" />
            <h3 className="font-semibold text-sm text-primary-ink">SOLID Review</h3>
          </div>
          <p className="text-xs text-primary/70">Analysis of Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion principles.</p>
          <div className="mt-3 text-[10px] uppercase font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded-full inline-block">Coming Soon</div>
        </div>

        <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 opacity-70">
          <div className="flex items-center gap-2 mb-2">
            <Layers size={16} className="text-purple-500" />
            <h3 className="font-semibold text-sm text-primary-ink">Design Patterns</h3>
          </div>
          <p className="text-xs text-primary/70">Suggestions for applicable Gang of Four design patterns based on your current architecture.</p>
          <div className="mt-3 text-[10px] uppercase font-bold text-purple-500 bg-purple-500/10 px-2 py-1 rounded-full inline-block">Coming Soon</div>
        </div>

        <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 opacity-70">
          <div className="flex items-center gap-2 mb-2">
            <Code2 size={16} className="text-green-500" />
            <h3 className="font-semibold text-sm text-primary-ink">Missing Classes</h3>
          </div>
          <p className="text-xs text-primary/70">Detection of missing entities required to satisfy the problem statement constraints.</p>
          <div className="mt-3 text-[10px] uppercase font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full inline-block">Coming Soon</div>
        </div>
        
        <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 opacity-70">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={16} className="text-yellow-500" />
            <h3 className="font-semibold text-sm text-primary-ink">Coupling & Cohesion</h3>
          </div>
          <p className="text-xs text-primary/70">Metrics on how tightly coupled your classes are and suggestions to improve cohesion.</p>
          <div className="mt-3 text-[10px] uppercase font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full inline-block">Coming Soon</div>
        </div>

      </div>

      <div className="p-4 border-t border-primary/10 bg-primary/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-primary-ink">Overall Score</span>
          <span className="text-sm font-bold text-primary/40">-- / 100</span>
        </div>
        <div className="w-full bg-primary/10 rounded-full h-2">
          <div className="bg-primary/30 h-2 rounded-full w-0"></div>
        </div>
      </div>
    </div>
  );
}
