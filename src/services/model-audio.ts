import * as Speech from 'expo-speech';
/** Temporary device TTS. Replace with a licensed audioUrl when production speaker audio is available. */
export const modelAudio = { speak(text: string, rate = 0.9) { Speech.stop(); Speech.speak(text, { language: 'en-US', rate }); }, stop() { Speech.stop(); } };
