export type Level = 'Beginner' | 'Intermediate' | 'Advanced';
export type Category = { id: string; name: string; icon: string; description: string };
export type Situation = { id: string; categoryId: string; name: string; description: string };
export type Lesson = { id: string; title: string; description: string; level: Level; duration: string; progress: number; category: string };
export type VideoSentence = { id: string; startTime: number; endTime: number; text: string; korean: string; isKeySentence: boolean; audioUrl?: string; vocabulary: string[]; expressions: string[] };
/** `videoUrl` accepts a future remote URL or a bundled Expo asset module ID for reliable MVP playback. */
export type VideoLesson = { id: string; title: string; description: string; categoryId: string; situationId: string; level: Level; duration: number; thumbnail: string; videoUrl: string | number; sentences: VideoSentence[]; tags: string[]; progress: number; isRecommended?: boolean; isNew?: boolean; speaker: string; accent: string; playbackSpeed: number };
export type ShadowingMode = 'full' | 'key' | 'custom';
export type AnalysisStatus = 'good' | 'watch' | 'retry';
export type PhonemeAssessment = { phoneme: string; score: number; startTime?: number; endTime?: number; confidence?: number; feedback?: string };
/** A word or phrase alignment result. Timing/phonemes are optional until a real provider supplies them. */
export type AnalysisSegment = { text: string; score: number; status: AnalysisStatus; feedback?: string; word?: string; startTime?: number; endTime?: number; confidence?: number; phonemes?: PhonemeAssessment[] };
export type PronunciationGuide = { word: string; ipa: string; targetSound: string; tonguePosition: string; airflow: string; voicing: string; commonMistake: string; practiceTip: string };
export type SpeechRecording = { uri: string; durationMillis?: number; mimeType?: string };
export type SpeechAnalysisTarget = { lessonId: string; sentenceId: string; text: string; words: string[] };
export type SpeechAnalysisRequest = { recording: SpeechRecording; target: SpeechAnalysisTarget; attemptId?: string };
export type PronunciationAnalysis = { overallScore: number; pronunciationScore: number; intonationScore: number; rhythmScore: number; fluencyScore: number; categories: { label: string; score: number }[]; segments: AnalysisSegment[]; wordScores: AnalysisSegment[]; weakWords: AnalysisSegment[]; isMock: boolean };
/** Provider boundary: a future service can return word alignment and optional phoneme assessments. */
export interface SpeechAnalysisService { analyze(request: SpeechAnalysisRequest): Promise<PronunciationAnalysis>; }
export interface KeySentenceService { selectSentences(lesson: VideoLesson): Promise<VideoSentence[]>; }
export interface RecommendationService { getRecommendations(lessons: VideoLesson[]): Promise<VideoLesson[]>; }
