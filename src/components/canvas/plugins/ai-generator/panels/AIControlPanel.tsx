import React, { useState } from 'react';
import { useAIGenerator } from '../context/AIGeneratorContext';
import { Sparkles, Image as ImageIcon, FileText, Settings, History, PanelLeftClose, AlertTriangle, X } from 'lucide-react';
import { convertJSONToExcalidraw } from '../utils/JSONToExcalidraw';

const EXAMPLES = [
  'Design Instagram',
  'Design Uber',
  'Design Netflix',
  'Design WhatsApp',
  'Design Discord',
  'Design URL Shortener',
];

interface AIControlPanelProps {
  excalidrawAPI: any;
  onClose?: () => void;
}

export function AIControlPanel({ excalidrawAPI, onClose }: AIControlPanelProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    prompt,
    setPrompt,
    isGenerating,
    setIsGenerating,
    setExplanationData,
    complexity,
    setComplexity,
    cloudProvider,
    setCloudProvider,
    setLoadedElements,
  } = useAIGenerator();

  const handleGenerate = async () => {
    if (!prompt.trim() || !excalidrawAPI) return;
    
    setErrorMessage(null);
    setIsGenerating(true);
    setExplanationData(null);
    
    try {
      const res = await fetch('/api/ai/generate-architecture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, complexity, cloudProvider }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrorMessage(data.error || data.message || 'Generation failed. Please try again.');
        setIsGenerating(false);
        return;
      }
      
      // Convert JSON to Excalidraw Elements
      const elements = convertJSONToExcalidraw(data);
      
      // Update Canvas
      excalidrawAPI.updateScene({ elements });
      excalidrawAPI.scrollToContent(elements, { fitToContent: true });
      
      // Save elements to state for persistence/resets if needed
      setLoadedElements(elements);
      
      // Set explanation panel data
      setExplanationData(data.explanation);
      
    } catch (err: any) {
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-80 h-full bg-surface border-r border-primary/10 flex flex-col shadow-xl z-20 transition-all duration-300">
      <div className="p-5 border-b border-primary/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Sparkles size={18} />
          </div>
          <h2 className="font-heading font-bold text-primary-ink">AI Architect</h2>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-1.5 text-primary/60 hover:text-primary-ink hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
            title="Close Panel"
          >
            <PanelLeftClose size={18} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        
        {/* Prompt Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-primary-ink">System Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="e.g. Design Instagram, WhatsApp..."
            className="w-full h-32 p-3 bg-transparent border border-primary/20 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full py-3 bg-primary hover:bg-primary-ink disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-surface rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-md"
        >
          {isGenerating ? (
            <span className="animate-pulse">Generating...</span>
          ) : (
            <>
              <Sparkles size={18} /> Generate Architecture
            </>
          )}
        </button>

        {/* In-Panel Limit / Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-primary-ink flex items-start gap-2.5 shadow-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-amber-900">Feature Limit Notice</p>
              <p className="mt-0.5 text-primary/80 leading-relaxed">{errorMessage}</p>
            </div>
            <button 
              onClick={() => setErrorMessage(null)}
              className="text-primary/40 hover:text-primary-ink p-0.5 transition-colors cursor-pointer"
              title="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Settings */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary-ink">
            <Settings size={16} /> Generation Settings
          </div>
          
          <div className="space-y-1">
            <label className="text-xs text-primary/60">Complexity</label>
            <select
              value={complexity}
              onChange={(e) => setComplexity(e.target.value)}
              className="w-full p-2 bg-transparent border border-primary/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="FAANG Interview">FAANG Interview</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-primary/60">Cloud Provider</label>
            <select
              value={cloudProvider}
              onChange={(e) => setCloudProvider(e.target.value)}
              className="w-full p-2 bg-transparent border border-primary/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            >
              <option value="Generic">Generic</option>
              <option value="AWS">AWS</option>
              <option value="Azure">Azure</option>
              <option value="GCP">GCP</option>
            </select>
          </div>
        </div>

        {/* Examples */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-primary-ink">Example Prompts</label>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => setPrompt(ex)}
                className="px-3 py-1.5 bg-primary/5 hover:bg-primary/10 rounded-full text-xs font-medium text-primary/80 transition-colors cursor-pointer"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
