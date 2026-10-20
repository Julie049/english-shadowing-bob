import { useEvent } from 'expo';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { palette } from '@/constants/design';
import type { VideoLesson } from '@/types/learning';
type Props = { lesson: VideoLesson; onSentenceChange?: (index: number) => void; seekToTime?: number };
export function LearningVideoPlayer({ lesson, onSentenceChange, seekToTime }: Props) {
  const player = useVideoPlayer(lesson.videoUrl, video => { video.loop = false; });
  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
  const event = useEvent(player, 'timeUpdate', { currentTime: 0, bufferedPosition: 0, currentLiveTimestamp: null, currentOffsetFromLive: null });
  useEffect(() => { const active = lesson.sentences.findIndex(sentence => event.currentTime >= sentence.startTime && event.currentTime < sentence.endTime); if (active >= 0) onSentenceChange?.(active); }, [event.currentTime, lesson.sentences, onSentenceChange]);
  useEffect(() => { if (seekToTime === undefined) return; // eslint-disable-next-line react-hooks/immutability
    player.currentTime = seekToTime; player.play(); }, [player, seekToTime]);
  const setRate = (rate: number) => { /* Expo Video exposes playbackRate as its SDK 57 control. */ // eslint-disable-next-line react-hooks/immutability
    player.playbackRate = rate; };
  const replay = () => { player.replay(); player.play(); };
  return <View style={styles.wrap}><VideoView player={player} style={styles.video} nativeControls={false} contentFit="cover" /><View style={styles.overlay}><Text style={styles.demo}>DEMO VIDEO · MODEL AUDIO</Text></View><View style={styles.controls}><Pressable onPress={() => isPlaying ? player.pause() : player.play()} style={styles.play}><Text style={styles.playText}>{isPlaying ? 'Ⅱ' : '▶'}</Text></Pressable><Pressable onPress={replay}><Text style={styles.control}>↺ Replay</Text></Pressable>{[0.75, 1, 1.25].map(rate => <Pressable key={rate} onPress={() => setRate(rate)} style={styles.rate}><Text style={styles.control}>{rate}×</Text></Pressable>)}</View></View>;
}
const styles = StyleSheet.create({ wrap: { borderRadius: 26, overflow: 'hidden', backgroundColor: palette.ink, aspectRatio: 16 / 10 }, video: { width: '100%', height: '100%' }, overlay: { position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(0,0,0,.55)', borderRadius: 12, paddingHorizontal: 9, paddingVertical: 5 }, demo: { color: '#fff', fontSize: 9, fontWeight: '800', letterSpacing: .6 }, controls: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'rgba(0,0,0,.58)', flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 14, paddingVertical: 11 }, play: { width: 28, alignItems: 'center' }, playText: { color: '#fff', fontSize: 18 }, control: { color: '#fff', fontSize: 12, fontWeight: '800' }, rate: { marginLeft: 'auto' } });
