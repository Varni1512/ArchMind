import React, { useEffect } from 'react';
import { Excalidraw, MainMenu, WelcomeScreen } from '@excalidraw/excalidraw';
import { LogoIcon } from '@/components/icons/LogoIcon';

interface Props {
  onAPI?: (api: any) => void;
}


export default function ArchMindCanvas({ onAPI }: Props) {
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

  return (
    <Excalidraw 
      key="archmind-canvas-force-reset"
      theme="light"
      name="ArchMind Canvas"
      initialData={{ appState: { viewBackgroundColor: "#fffce8" } }}
      excalidrawAPI={onAPI}
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
  );
}
