import { 
  STORAGE_KEYS, 
  saveCanvasData, 
  loadCanvasData, 
  clearCanvasData, 
  sanitizeAppState 
} from '@/lib/storage/canvasPersistence';
import { AIGeneratedArchitecture } from '@/services/ai/types';

export interface AIHistoryRecord {
  id: string;
  title: string;
  prompt: string;
  complexity: string;
  cloudProvider: string;
  createdAt: number;
  elements: any[];
  appState?: any;
  explanation?: AIGeneratedArchitecture['explanation'];
}

export interface AISessionState {
  prompt: string;
  complexity: string;
  cloudProvider: string;
  elements: any[];
  appState?: any;
  explanationData?: AIGeneratedArchitecture['explanation'] | null;
  timestamp: number;
}

const MAX_HISTORY_ITEMS = 50;

export class AIGeneratorHistoryManager {
  private static HISTORY_KEY = STORAGE_KEYS.AI_HISTORY;
  private static SESSION_KEY = STORAGE_KEYS.AI_SESSION;

  /**
   * Derive a clean, human-readable title from prompt
   */
  private static generateTitle(prompt: string): string {
    const cleaned = prompt.trim().replace(/^design\s+/i, '');
    if (!cleaned) return 'System Architecture';
    const firstSentence = cleaned.split(/[.\n]/)[0].trim();
    if (firstSentence.length <= 40) {
      return firstSentence.charAt(0).toUpperCase() + firstSentence.slice(1);
    }
    return firstSentence.slice(0, 37) + '...';
  }

  /**
   * Add a new generated architecture into history
   */
  static addHistory(entry: {
    prompt: string;
    complexity: string;
    cloudProvider: string;
    elements: any[];
    appState?: any;
    explanation?: AIGeneratedArchitecture['explanation'];
    title?: string;
  }): AIHistoryRecord {
    const history = this.getHistory();
    const title = entry.title || this.generateTitle(entry.prompt);

    const newRecord: AIHistoryRecord = {
      id: `ai_gen_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      title,
      prompt: entry.prompt,
      complexity: entry.complexity,
      cloudProvider: entry.cloudProvider,
      createdAt: Date.now(),
      elements: entry.elements,
      appState: sanitizeAppState(entry.appState),
      explanation: entry.explanation,
    };

    // Prepend to top and limit total count
    const updatedHistory = [newRecord, ...history].slice(0, MAX_HISTORY_ITEMS);
    saveCanvasData(this.HISTORY_KEY, updatedHistory);

    return newRecord;
  }

  /**
   * Get all saved history items ordered by newest first
   */
  static getHistory(): AIHistoryRecord[] {
    const data = loadCanvasData<AIHistoryRecord[]>(this.HISTORY_KEY);
    return Array.isArray(data) ? data : [];
  }

  /**
   * Delete a single history item by id
   */
  static deleteHistory(id: string): void {
    const history = this.getHistory();
    const filtered = history.filter((item) => item.id !== id);
    saveCanvasData(this.HISTORY_KEY, filtered);
  }

  /**
   * Clear all generation history
   */
  static clearAllHistory(): void {
    clearCanvasData(this.HISTORY_KEY);
  }

  /**
   * Save the active working session
   */
  static saveSession(session: {
    prompt: string;
    complexity: string;
    cloudProvider: string;
    elements: any[];
    appState?: any;
    explanationData?: AIGeneratedArchitecture['explanation'] | null;
  }): void {
    saveCanvasData(this.SESSION_KEY, {
      ...session,
      appState: sanitizeAppState(session.appState),
      timestamp: Date.now(),
    });
  }

  /**
   * Load the active working session
   */
  static loadSession(): AISessionState | null {
    return loadCanvasData<AISessionState>(this.SESSION_KEY);
  }

  /**
   * Clear the active session
   */
  static clearSession(): void {
    clearCanvasData(this.SESSION_KEY);
  }
}
