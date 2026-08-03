import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { Excalidraw, MainMenu, WelcomeScreen } from '@excalidraw/excalidraw';
import { LogoIcon } from '@/components/icons/LogoIcon';
import { 
  loadCanvasData, 
  sanitizeAppState, 
  CanvasDebouncedSaver, 
  STORAGE_KEYS,
  PersistedCanvasData 
} from '@/lib/storage/canvasPersistence';
import { CloudCheck, Cloud, Loader2 } from 'lucide-react';

interface Props {
  onAPI?: (api: any) => void;
  onChange?: (elements: readonly any[], appState: any, files: any) => void;
  initialData?: any;
  storageKey?: string;
  autoSave?: boolean;
  showSaveIndicator?: boolean;
}

export default function ArchMindCanvas({ 
  onAPI, 
  onChange, 
  initialData: propInitialData, 
  storageKey, 
  autoSave = false,
  showSaveIndicator = false 
}: Props) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('saved');
  const saverRef = useRef<CanvasDebouncedSaver | null>(null);
  const statusTimerRef = useRef<any>(null);

  // Initialize storage saver if autoSave is enabled or storageKey is provided
  useEffect(() => {
    if (storageKey && autoSave) {
      saverRef.current = new CanvasDebouncedSaver(storageKey, 400, (success) => {
        if (success) {
          setSaveStatus('saved');
          if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
          statusTimerRef.current = setTimeout(() => {
            setSaveStatus('idle');
          }, 2500);
        }
      });
    }

    return () => {
      if (saverRef.current) {
        saverRef.current.destroy();
      }
      if (statusTimerRef.current) {
        clearTimeout(statusTimerRef.current);
      }
    };
  }, [storageKey, autoSave]);

  // Compute initial data from storage if not provided via props
  const computedInitialData = useMemo(() => {
    if (propInitialData) {
      return propInitialData;
    }

    if (storageKey) {
      const saved = loadCanvasData<PersistedCanvasData>(storageKey);
      if (saved && Array.isArray(saved.elements) && saved.elements.length > 0) {
        return {
          elements: saved.elements,
          appState: {
            viewBackgroundColor: '#fffce8',
            ...(saved.appState || {}),
          },
          files: saved.files || {},
          scrollToContent: true,
        };
      }
    }

    return { 
      appState: { 
        viewBackgroundColor: '#fffce8' 
      } 
    };
  }, [propInitialData, storageKey]);

  /**
   * Registers a global listener to ensure that active radix-ui popovers 
   * are properly dismissed when interacting with the canvas element.
   */
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (e.target instanceof HTMLCanvasElement) {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
      }
    };
    
    // Use capture phase to ensure it runs before Excalidraw's internal handlers might stop propagation
    document.addEventListener('pointerdown', handlePointerDown, { capture: true });
    return () => document.removeEventListener('pointerdown', handlePointerDown, { capture: true });
  }, []);

  const handleChange = useCallback((elements: readonly any[], appState: any, files: any) => {
    if (autoSave && saverRef.current) {
      setSaveStatus('saving');
      saverRef.current.save({
        elements,
        appState: sanitizeAppState(appState),
        files,
        timestamp: Date.now(),
      });
    }

    if (onChange) {
      onChange(elements, appState, files);
    }
  }, [autoSave, onChange]);

  return (
    <div className="relative w-full h-full">
      <Excalidraw 
        key={`archmind-canvas-${storageKey || 'default'}`}
        theme="light"
        name="ArchMind Canvas"
        initialData={computedInitialData}
        excalidrawAPI={onAPI}
        onChange={handleChange}
      >
        {/* Custom Main Menu Configuration */}
        <MainMenu>
          <MainMenu.DefaultItems.SaveToActiveFile />
          <MainMenu.DefaultItems.Export />
          <MainMenu.DefaultItems.SaveAsImage />
          <MainMenu.DefaultItems.ClearCanvas />
          <MainMenu.Separator />
          <MainMenu.DefaultItems.ChangeCanvasBackground />
        </MainMenu>

        {/* Custom Welcome Screen Configuration */}
        <WelcomeScreen>
          <WelcomeScreen.Hints.MenuHint />
          <WelcomeScreen.Hints.ToolbarHint />
          
          <WelcomeScreen.Center>
            <WelcomeScreen.Center.Logo>
              <div className="flex items-center gap-3 select-none mb-4">
                <LogoIcon className="w-10 h-10" />
                <span className="text-3xl font-extrabold text-[#354259] tracking-tight" style={{ fontFamily: 'var(--font-inter)' }}>ArchMind</span>
              </div>
            </WelcomeScreen.Center.Logo>
            <WelcomeScreen.Center.Heading>
              Blank Canvas Workspace
            </WelcomeScreen.Center.Heading>
          </WelcomeScreen.Center>
        </WelcomeScreen>

        {/* CSS to hide Excalidraw's internal Library and Sidebar buttons that overlap with our custom UI */}
        <style>{`
          .excalidraw .sidebar-trigger,
          .excalidraw [data-testid="sidebar-trigger"],
          .excalidraw [aria-label="Library"],
          .excalidraw .layer-ui__library-button,
          .excalidraw .layer-ui__wrapper button[title*="Help"],
          .excalidraw .layer-ui__wrapper button[aria-label*="Help"],
          .excalidraw .layer-ui__wrapper [data-testid="help-menu"],
          .excalidraw .layer-ui__wrapper label[title*="Lock"],
          .excalidraw .layer-ui__wrapper label[title*="Keep"],
          .excalidraw .layer-ui__wrapper [aria-label*="Lock"],
          .excalidraw .layer-ui__wrapper [aria-label*="Keep"],
          .excalidraw .layer-ui__wrapper [data-testid="toggle-lock"],
          .excalidraw .layer-ui__wrapper label[title*="Hand"],
          .excalidraw .layer-ui__wrapper [aria-label*="Hand"],
          .excalidraw .layer-ui__wrapper [data-testid="toolbar-hand"],
          .excalidraw .layer-ui__wrapper button[aria-label*="More"],
          .excalidraw .layer-ui__wrapper button[aria-label*="Shapes"],
          .excalidraw .layer-ui__wrapper button[title*="Shapes"],
          .excalidraw .layer-ui__wrapper button[title*="More tools"],
          .excalidraw .layer-ui__wrapper [aria-label="More tools"],
          .excalidraw .layer-ui__wrapper [data-testid="toolbar-more-tools"] {
            display: none !important;
          }

          /* Push Excalidraw's left menu to the right to make room for our Explorer button */
          .excalidraw .App-menu_top__left {
            margin-left: 56px !important;
          }
        `}</style>
      </Excalidraw>

      {/* Persistent Auto-Save Status Indicator */}
      {showSaveIndicator && saveStatus !== 'idle' && (
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-surface/90 backdrop-blur-md border border-primary/10 rounded-full shadow-sm text-xs font-medium text-primary/70 transition-all duration-300 pointer-events-none select-none">
          {saveStatus === 'saving' ? (
            <>
              <Loader2 size={13} className="animate-spin text-primary" />
              <span>Saving changes...</span>
            </>
          ) : (
            <>
              <CloudCheck size={14} className="text-emerald-600" />
              <span className="text-emerald-700">Auto-saved to device</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
