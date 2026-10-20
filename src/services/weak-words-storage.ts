import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AnalysisSegment } from '@/types/learning';

const STORAGE_KEY = 'weak_words_v1';
const SEEN_ATTEMPTS_KEY = 'weak_words_seen_attempts_v1';

export type WeakWordEntry = {
  word: string;
  count: number;
  lastScore: number;
};

type StoredMap = Record<string, WeakWordEntry>;

/** Load the current weak-word map from storage. Returns {} on any error. */
async function loadMap(): Promise<StoredMap> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredMap) : {};
  } catch {
    return {};
  }
}

/** Load the set of already-processed attemptIds. Returns new Set() on any error. */
async function loadSeenAttempts(): Promise<Set<string>> {
  try {
    const raw = await AsyncStorage.getItem(SEEN_ATTEMPTS_KEY);
    const arr: string[] = raw ? JSON.parse(raw) : [];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

/**
 * Record weak words from one analysis attempt.
 * If attemptId has already been recorded, this is a no-op (idempotent).
 * All storage errors are swallowed so the app never crashes here.
 */
export async function recordWeakWords(
  attemptId: string,
  weakWords: AnalysisSegment[],
): Promise<void> {
  try {
    const [map, seen] = await Promise.all([loadMap(), loadSeenAttempts()]);
    if (seen.has(attemptId)) return;

    for (const segment of weakWords) {
      const key = (segment.word ?? segment.text).toLowerCase().trim();
      if (!key) continue;
      const existing = map[key];
      map[key] = {
        word: segment.word ?? segment.text,
        count: (existing?.count ?? 0) + 1,
        lastScore: segment.score,
      };
    }

    seen.add(attemptId);

    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(map)),
      AsyncStorage.setItem(SEEN_ATTEMPTS_KEY, JSON.stringify([...seen])),
    ]);
  } catch {
    // Storage errors must never crash the app
  }
}

/**
 * Load the current weak-word list sorted by count descending.
 * Returns [] on any error.
 */
export async function loadWeakWords(): Promise<WeakWordEntry[]> {
  try {
    const map = await loadMap();
    return Object.values(map).sort((a, b) => b.count - a.count);
  } catch {
    return [];
  }
}
