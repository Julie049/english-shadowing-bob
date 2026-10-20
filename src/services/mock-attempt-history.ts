import type { PronunciationAnalysis } from '@/types/learning';
export type MockAttempt = { recordingUri: string; result: PronunciationAnalysis };
const attemptsBySentence = new Map<string, MockAttempt[]>();
/** In-memory Phase 1 repository. It only appends a result for a new recording URI. */
export const mockAttemptHistory = { get(sentenceId: string) { return attemptsBySentence.get(sentenceId) ?? []; }, record(sentenceId: string, recordingUri: string, result: PronunciationAnalysis) { const current = this.get(sentenceId); if (current.some(attempt => attempt.recordingUri === recordingUri)) return current; const next = [...current, { recordingUri, result }]; attemptsBySentence.set(sentenceId, next); return next; } };
