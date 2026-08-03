import { generateNKeysBetween } from 'fractional-indexing';

/**
 * Assigns clean, monotonically increasing fractional indices to all elements.
 * This guarantees that Excalidraw's fractional indexing invariant
 * (predecessor.index < element.index < successor.index) is always strictly satisfied.
 */
export function normalizeFractionalIndices<T extends Record<string, any>>(
  elements: readonly T[]
): T[] {
  if (!elements || !Array.isArray(elements) || elements.length === 0) {
    return [];
  }

  try {
    const keys = generateNKeysBetween(null, null, elements.length);
    return elements.map((el, idx) => {
      if (!el || typeof el !== 'object') return el;
      return {
        ...el,
        index: keys[idx] || `a${idx}`,
      };
    });
  } catch {
    // Fallback in case of unexpected errors
    return elements.map((el, idx) => {
      if (!el || typeof el !== 'object') return el;
      return {
        ...el,
        index: `a${String(idx).padStart(4, '0')}`,
      };
    });
  }
}

/**
 * Strips corrupted/duplicate indices before restoring with Excalidraw's restoreElements,
 * then enforces normalized fractional indices.
 */
export async function safeRestoreElements(
  elements: readonly any[],
  localElements?: readonly any[] | null
): Promise<any[]> {
  if (!elements || !Array.isArray(elements) || elements.length === 0) {
    return [];
  }

  try {
    const { restoreElements } = await import('@excalidraw/excalidraw');
    
    // Strip index from incoming elements so restoreElements doesn't fail on collisions
    const stripped = elements.map(el => {
      if (!el || typeof el !== 'object') return el;
      const { index, ...rest } = el;
      return rest;
    });

    const restored = restoreElements(stripped, localElements, { repairBindings: true });
    return normalizeFractionalIndices(restored);
  } catch (err) {
    console.warn('[ArchMind] Safe restore fallback used:', err);
    return normalizeFractionalIndices(elements);
  }
}

/**
 * Merges current canvas elements with newly created elements (e.g. from toolbar / AI)
 * ensuring all elements have distinct and valid sequential fractional indices.
 */
export async function safeMergeElements(
  currentElements: readonly any[],
  newElements: readonly any[]
): Promise<any[]> {
  const currentList = Array.isArray(currentElements) ? currentElements : [];
  const newList = Array.isArray(newElements) ? newElements : [];
  
  if (newList.length === 0) return normalizeFractionalIndices(currentList);

  try {
    const { restoreElements, convertToExcalidrawElements } = await import('@excalidraw/excalidraw');
    
    // Convert new elements to proper Excalidraw elements
    const validNew = convertToExcalidrawElements(newList);
    
    // Combine and strip indices to recalculate full sequence
    const combined = [...currentList, ...validNew].map(el => {
      if (!el || typeof el !== 'object') return el;
      const { index, ...rest } = el;
      return rest;
    });

    const restored = restoreElements(combined, null, { repairBindings: true });
    return normalizeFractionalIndices(restored);
  } catch (err) {
    console.warn('[ArchMind] Safe merge fallback used:', err);
    const combined = [...currentList, ...newList];
    return normalizeFractionalIndices(combined);
  }
}
