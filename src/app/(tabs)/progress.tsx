import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Card, ProgressBar, Screen } from '@/components/ui';
import { palette } from '@/constants/design';
import { loadWeakWords, type WeakWordEntry } from '@/services/weak-words-storage';

export default function Progress() {
  const [weakWords, setWeakWords] = useState<WeakWordEntry[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadWeakWords().then(setWeakWords);
    }, []),
  );

  return (
    <Screen>
      <SafeAreaView style={s.safe}>
        <ScrollView contentContainerStyle={s.content}>
          <Text style={s.title}>Your progress</Text>
          <Text style={s.sub}>Your speaking is becoming more natural.</Text>
          <Card style={s.scoreCard}>
            <Text style={s.label}>WEEKLY SPEAKING SCORE</Text>
            <Text style={s.score}>84</Text>
            <ProgressBar value={84} />
            <Text style={s.up}>↑ 12 points from last week</Text>
          </Card>
          <View style={s.stats}>
            {([['12', 'Shadowing\nsessions'], ['86', 'Practice\nminutes'], ['8', 'Videos\ncompleted']] as const).map(([n, l]) => (
              <Card key={n} style={s.stat}>
                <Text style={s.n}>{n}</Text>
                <Text style={s.statLabel}>{l}</Text>
              </Card>
            ))}
          </View>
          <Text style={s.heading}>Recent improvement</Text>
          <Card>
            <Text style={s.trend}>
              68{'  →  '}76{'  →  '}84{'  →  '}
              <Text style={{ color: palette.green }}>91</Text>
            </Text>
            <Text style={s.sub}>Best pronunciation · Best fluency · Most improved: rhythm</Text>
          </Card>
          <Text style={s.heading}>Situation progress</Text>
          {([['☕ Coffee & Food', 80], ['🛍️ Shopping', 60], ['🏫 College', 40]] as [string, number][]).map(([name, value]) => (
            <Card key={name} style={s.situation}>
              <View style={s.situationRow}>
                <Text style={s.situationName}>{name}</Text>
                <Text style={s.percent}>{value}%</Text>
              </View>
              <ProgressBar value={Number(value)} />
            </Card>
          ))}
          <Text style={s.heading}>Words to watch</Text>
          <Card>
            <Text style={s.demoNote}>Based on demo analysis</Text>
            {weakWords.length === 0 ? (
              <Text style={s.empty}>No words recorded yet. Complete a shadowing analysis to see results here.</Text>
            ) : (
              weakWords.slice(0, 8).map((entry) => (
                <View key={entry.word} style={s.wordRow}>
                  <Text style={s.wordText}>{entry.word}</Text>
                  <View style={s.wordRight}>
                    <Text style={s.wordScore}>{entry.lastScore}%</Text>
                    <View style={s.badge}>
                      <Text style={s.badgeText}>×{entry.count}</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </Card>
        </ScrollView>
      </SafeAreaView>
    </Screen>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 20, gap: 15 },
  title: { fontSize: 32, fontWeight: '800', color: palette.ink },
  sub: { fontSize: 14, lineHeight: 20, color: palette.muted },
  scoreCard: { backgroundColor: palette.sage },
  label: { fontSize: 10, fontWeight: '800', letterSpacing: 1, color: palette.muted },
  score: { fontSize: 47, fontWeight: '800', color: palette.ink, marginVertical: 5 },
  up: { fontSize: 13, fontWeight: '800', color: palette.green, marginTop: 12 },
  stats: { flexDirection: 'row', gap: 8 },
  stat: { flex: 1, padding: 13 },
  n: { fontSize: 24, fontWeight: '800', color: palette.ink },
  statLabel: { fontSize: 11, lineHeight: 14, color: palette.muted, marginTop: 4 },
  heading: { fontSize: 20, fontWeight: '800', color: palette.ink, marginTop: 7 },
  trend: { fontSize: 19, fontWeight: '800', color: palette.ink, marginBottom: 6 },
  situation: { gap: 8 },
  situationRow: { flexDirection: 'row', justifyContent: 'space-between' },
  situationName: { fontSize: 15, fontWeight: '700', color: palette.ink },
  percent: { fontSize: 15, fontWeight: '800', color: palette.muted },
  demoNote: { fontSize: 11, fontWeight: '700', color: palette.muted, letterSpacing: 0.5, marginBottom: 10 },
  empty: { fontSize: 14, color: palette.muted, lineHeight: 20 },
  wordRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: palette.line },
  wordText: { fontSize: 17, fontWeight: '800', color: palette.ink },
  wordRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  wordScore: { fontSize: 14, fontWeight: '700', color: palette.muted },
  badge: { backgroundColor: palette.lavender, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 12, fontWeight: '800', color: palette.ink },
});
