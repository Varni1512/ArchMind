/**
 * Unified Canvas Persistence Utility for ArchMind
 * Handles safe serialization, quota management, state sanitization,
 * and debounced auto-saving across Blank Canvas, LLD, HLD, and AI Creator.
 */

export const STORAGE_KEYS = {
  BLANK_CANVAS: 'archmind_blank_canvas_autosave',
  LLD_AUTOSAVE: 'archmind_lld_autosave',
  HLD_AUTOSAVE: 'archmind_hld_autosave',
  AI_SESSION: 'archmind_ai_generator_session',
  AI_HISTORY: 'archmind_ai_history',
  LLD_DIAGRAMS: 'archmind_lld_diagrams',
  HLD_DIAGRAMS: 'archmind_hld_diagrams',
} as const;

export interface PersistedCanvasData {
  elements: any[];
  appState?: {
    viewBackgroundColor?: string;
    zoom?: { value: number };
    scrollX?: number;
    scrollY?: number;
    gridSize?: number | null;
  };
  files?: Record<string, any>;
  metadata?: Record<string, any>;
  timestamp: number;
}

/**
 * Filter out transient / non-serializable properties from Excalidraw's appState
 * to avoid frozen UI or corrupted UI states upon restoration.
 */
export function sanitizeAppState(appState: any) {
  if (!appState || typeof appState !== 'object') return {};
  return {
    viewBackgroundColor: appState.viewBackgroundColor || '#faf9f6',
    zoom: appState.zoom ? { value: appState.zoom.value } : undefined,
    scrollX: typeof appState.scrollX === 'number' ? appState.scrollX : 0,
    scrollY: typeof appState.scrollY === 'number' ? appState.scrollY : 0,
    gridSize: appState.gridSize ?? null,
  };
}

/**
 * Safely save data to localStorage with error handling for quota limits.
 */
export function saveCanvasData(key: string, data: any): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error: any) {
    // If quota exceeded, try removing old scratch/history entries if key is not AI history
    if (error?.name === 'QuotaExceededError' || error?.code === 22) {
      console.warn(`[CanvasPersistence] Storage quota exceeded while saving to ${key}. Attempting prune.`);
      tryPruneStorage();
      try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
      } catch {
        console.error(`[CanvasPersistence] Failed to write to localStorage after pruning.`);
        return false;
      }
    }
    console.error(`[CanvasPersistence] Error saving to ${key}:`, error);
    return false;
  }
}

/**
 * Safely load parsed data from localStorage.
 */
export function loadCanvasData<T = PersistedCanvasData>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`[CanvasPersistence] Error loading from ${key}:`, error);
    return null;
  }
}

/**
 * Safely remove an item from localStorage.
 */
export function clearCanvasData(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`[CanvasPersistence] Error clearing ${key}:`, error);
  }
}

/**
 * Helper to prune older AI history items if localStorage hits quota limit.
 */
function tryPruneStorage() {
  try {
    const aiHistoryRaw = localStorage.getItem(STORAGE_KEYS.AI_HISTORY);
    if (aiHistoryRaw) {
      const history = JSON.parse(aiHistoryRaw);
      if (Array.isArray(history) && history.length > 5) {
        // Keep only newest 5 items
        const pruned = history.slice(0, 5);
        localStorage.setItem(STORAGE_KEYS.AI_HISTORY, JSON.stringify(pruned));
      }
    }
  } catch (e) {
    console.error('[CanvasPersistence] Pruning failed:', e);
  }
}

/**
 * Debounced Canvas Saver that also registers a `beforeunload` listener
 * so no state is lost if user immediately closes or refreshes the page.
 */
export class CanvasDebouncedSaver {
  private timer: any = null;
  private pendingData: any = null;
  private key: string;
  private delayMs: number;
  private onSaveCallback?: (saved: boolean) => void;

  constructor(key: string, delayMs = 400, onSaveCallback?: (saved: boolean) => void) {
    this.key = key;
    this.delayMs = delayMs;
    this.onSaveCallback = onSaveCallback;

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', this.flush);
    }
  }

  public save(data: any) {
    this.pendingData = data;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.flush();
    }, this.delayMs);
  }

  public flush = () => {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.pendingData !== null) {
      const success = saveCanvasData(this.key, this.pendingData);
      this.pendingData = null;
      if (this.onSaveCallback) {
        this.onSaveCallback(success);
      }
    }
  };

  public destroy() {
    this.flush();
    if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', this.flush);
    }
  }
}
