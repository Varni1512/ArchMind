import React from 'react';
import { Download, Save, Undo, Redo, ZoomIn, Maximize, Trash2 } from 'lucide-react';
import { exportToBlob } from '@excalidraw/excalidraw';

interface AIToolbarPluginProps {
  excalidrawAPI: any;
}

export function AIToolbarPlugin({ excalidrawAPI }: AIToolbarPluginProps) {
  if (!excalidrawAPI) return null;

  const handleExportPNG = async () => {
    const elements = excalidrawAPI.getSceneElements();
    if (!elements || !elements.length) return;
    try {
      const blob = await exportToBlob({
        elements,
        mimeType: 'image/png',
        appState: { exportBackground: true },
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `architecture-${Date.now()}.png`;
      a.click();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the canvas?')) {
      excalidrawAPI.updateScene({ elements: [] });
    }
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-surface/80 backdrop-blur-md border border-primary/10 rounded-2xl shadow-xl p-2 flex items-center gap-1 z-10">
      <button 
        onClick={() => excalidrawAPI.history.undo()}
        className="p-2 text-primary/60 hover:text-primary-ink hover:bg-primary/5 rounded-xl transition-colors cursor-pointer"
        title="Undo"
      >
        <Undo size={18} />
      </button>
      
      <button 
        onClick={() => excalidrawAPI.history.redo()}
        className="p-2 text-primary/60 hover:text-primary-ink hover:bg-primary/5 rounded-xl transition-colors cursor-pointer"
        title="Redo"
      >
        <Redo size={18} />
      </button>

      <div className="w-px h-6 bg-primary/10 mx-1" />

      <button 
        onClick={() => {
          const elements = excalidrawAPI.getSceneElements();
          excalidrawAPI.scrollToContent(elements, { fitToContent: true });
        }}
        className="p-2 text-primary/60 hover:text-primary-ink hover:bg-primary/5 rounded-xl transition-colors cursor-pointer"
        title="Fit to Screen"
      >
        <Maximize size={18} />
      </button>

      <div className="w-px h-6 bg-primary/10 mx-1" />

      <button 
        onClick={handleExportPNG}
        className="p-2 text-primary/60 hover:text-primary-ink hover:bg-primary/5 rounded-xl transition-colors cursor-pointer flex items-center gap-2 px-3"
        title="Export PNG"
      >
        <Download size={18} />
        <span className="text-xs font-semibold">Export</span>
      </button>

      <div className="w-px h-6 bg-primary/10 mx-1" />

      <button 
        onClick={handleClear}
        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
        title="Clear Canvas"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
