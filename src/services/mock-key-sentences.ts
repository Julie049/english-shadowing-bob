import type { KeySentenceService } from '@/types/learning';
export const mockKeySentenceService: KeySentenceService = { async selectSentences(lesson) { return lesson.sentences.filter(sentence => sentence.isKeySentence); } };
