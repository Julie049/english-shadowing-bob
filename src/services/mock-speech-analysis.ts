import type { AnalysisSegment, PronunciationAnalysis, SpeechAnalysisRequest, SpeechAnalysisService } from '@/types/learning';

const resultsByAttempt = new Map<string, PronunciationAnalysis>();
const analysesBySentence = new Map<string, number>();
const mockProgression = [68, 76, 84, 87, 91, 89, 93];

const statusFor = (score: number): AnalysisSegment['status'] =>
  score >= 85 ? 'good' : score >= 72 ? 'watch' : 'retry';

/**
 * Pre-defined segment samples keyed by sentenceId prefix, then by exact text.
 * Using sentenceId prevents cross-lesson contamination when two sentences share
 * a common word such as "medium".
 */
const SAMPLE_SEGMENTS: Record<string, AnalysisSegment[]> = {
  // coffee lesson: "Hi, can I get a medium latte?" — sentenceId coffee-1
  'coffee-1': [
    { text: 'Hi,', score: 95, status: 'good' },
    { text: 'can I', score: 92, status: 'good' },
    { text: 'get a', score: 84, status: 'watch' },
    { text: 'medium', word: 'medium', score: 70, status: 'retry' },
    { text: 'latte', word: 'latte', score: 65, status: 'retry', feedback: 'The stress pattern needs improvement.' },
  ],
  // shopping lesson: "Excuse me, do you have this in a medium?" — sentenceId shopping-1
  'shopping-1': [
    { text: 'Excuse me,', score: 95, status: 'good' },
    { text: 'do you have', score: 91, status: 'good' },
    { text: 'this', word: 'this', score: 65, status: 'retry' },
    { text: 'in a', score: 93, status: 'good' },
    { text: 'medium', word: 'medium', score: 64, status: 'retry', feedback: 'The stress pattern needs improvement.' },
  ],
};

/** Exact-text lookup as a secondary fallback (sentenceId is preferred). */
const SAMPLE_BY_TEXT: Record<string, AnalysisSegment[]> = {
  'hi, can i get a medium latte?': SAMPLE_SEGMENTS['coffee-1'],
  'excuse me, do you have this in a medium?': SAMPLE_SEGMENTS['shopping-1'],
};

/**
 * Return pre-defined segments for known sentenceIds/texts, or build generic
 * segments from the actual target text so the display always matches the
 * sentence that was practiced.
 */
function baseSegments(sentenceId: string, text: string): AnalysisSegment[] {
  // 1. Exact sentenceId match
  if (SAMPLE_SEGMENTS[sentenceId]) return SAMPLE_SEGMENTS[sentenceId];

  // 2. Prefix match (e.g. "coffee-1" prefix within a composite id)
  const prefixMatch = Object.keys(SAMPLE_SEGMENTS).find(key => sentenceId.startsWith(key));
  if (prefixMatch) return SAMPLE_SEGMENTS[prefixMatch];

  // 3. Exact text match (case-insensitive)
  const byText = SAMPLE_BY_TEXT[text.toLowerCase().trim()];
  if (byText) return byText;

  // 4. Generic fallback: tokenise the actual target text — always consistent
  return text
    .replace(/[?.!,]/g, '')
    .split(' ')
    .filter(Boolean)
    .map((word, index) => ({
      text: word,
      word,
      score: [82, 78, 70, 64][index % 4],
      status: (index % 4 > 1 ? 'retry' : 'watch') as AnalysisSegment['status'],
      feedback: index % 4 === 3 ? 'Try a clearer vowel and word stress.' : undefined,
    }));
}

function createMockResult(request: SpeechAnalysisRequest, attemptIndex: number): PronunciationAnalysis {
  const overallScore = mockProgression[Math.min(attemptIndex, mockProgression.length - 1)];
  const improvement = [0, 7, 14, 18, 24, 21, 27][Math.min(attemptIndex, 6)];
  const segments = baseSegments(request.target.sentenceId, request.target.text).map((segment, index) => {
    const score = Math.min(98, segment.score + improvement + (index % 2 ? -2 : 0));
    return { ...segment, score, status: statusFor(score), confidence: 0.7 + (score / 100) * 0.25 };
  });
  const pronunciationScore = Math.min(97, overallScore + 2);
  const intonationScore = Math.max(60, overallScore - 5);
  const rhythmScore = Math.max(60, overallScore - 2);
  const fluencyScore = Math.min(98, overallScore + 4);
  return {
    overallScore, pronunciationScore, intonationScore, rhythmScore, fluencyScore,
    isMock: true,
    categories: [
      { label: 'Pronunciation', score: pronunciationScore },
      { label: 'Intonation', score: intonationScore },
      { label: 'Rhythm', score: rhythmScore },
      { label: 'Fluency', score: fluencyScore },
    ],
    segments,
    wordScores: segments,
    weakWords: segments.filter(segment => segment.status !== 'good'),
  };
}

/** Prototype-only provider. It receives real recording metadata but does not inspect audio. */
export const mockSpeechAnalysisService: SpeechAnalysisService = {
  async analyze(request) {
    const attemptKey = request.attemptId ?? request.recording.uri;
    const cached = resultsByAttempt.get(attemptKey);
    if (cached) return cached;
    await new Promise(resolve => setTimeout(resolve, 700));
    const attemptIndex = analysesBySentence.get(request.target.sentenceId) ?? 0;
    const result = createMockResult(request, attemptIndex);
    analysesBySentence.set(request.target.sentenceId, attemptIndex + 1);
    resultsByAttempt.set(attemptKey, result);
    return result;
  },
};
