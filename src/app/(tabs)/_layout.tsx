import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { palette } from '@/constants/design';
const icons: Record<string, string> = { index: '⌂', learn: '◫', practice: '◉', progress: '⌁', profile: '◌' };
export default function TabLayout() { return <Tabs screenOptions={({ route }) => ({ headerShown: false, tabBarActiveTintColor: palette.ink, tabBarInactiveTintColor: palette.muted, tabBarStyle: { height: 82, paddingTop: 8, borderTopColor: palette.line, backgroundColor: palette.canvas }, tabBarLabelStyle: { fontSize: 11, fontWeight: '600' }, tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22, lineHeight: 23 }}>{icons[route.name]}</Text> })}><Tabs.Screen name="index" options={{ title: 'Home' }} /><Tabs.Screen name="learn" options={{ title: 'Learn' }} /><Tabs.Screen name="practice" options={{ title: 'Practice' }} /><Tabs.Screen name="progress" options={{ title: 'Progress' }} /><Tabs.Screen name="profile" options={{ title: 'Profile' }} /></Tabs>; }
