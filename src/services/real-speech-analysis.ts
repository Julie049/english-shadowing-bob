import type { PronunciationAnalysis, SpeechAnalysisRequest, SpeechAnalysisService } from '@/types/learning';
/** Future provider seam. Intentionally makes no network/API calls in this prototype. */
export class RealSpeechAnalysisService implements SpeechAnalysisService { async analyze(_request: SpeechAnalysisRequest): Promise<PronunciationAnalysis> { throw new Error('Real speech analysis has not been configured.'); } }
