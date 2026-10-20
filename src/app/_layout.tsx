import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
export default function RootLayout() { return <><StatusBar style="dark" /><Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}><Stack.Screen name="(tabs)" /><Stack.Screen name="lesson/[id]" /><Stack.Screen name="listen/[id]" /><Stack.Screen name="shadow/[id]" /><Stack.Screen name="analysis/[id]" /><Stack.Screen name="pronunciation/[id]" /><Stack.Screen name="video/[id]" /><Stack.Screen name="shadow-mode/[id]" /><Stack.Screen name="custom-shadow/[id]" /></Stack></>; }
