# English Shadowing — Built Further with IBM Bob

A mobile prototype for practising English pronunciation by situation.  
Record yourself shadowing real dialogue, get word-level demo feedback, and track which words appear most often across sessions.

Built with [Expo](https://expo.dev) (SDK 57) · React Native · TypeScript.

---

## What the app does

| Screen | Purpose |
|--------|---------|
| Learn tab | Browse lessons by situation (Coffee, Shopping, College, …) |
| Lesson detail | Read the target sentence, see the learning flow |
| Listen | Hear a model pronunciation before recording |
| Shadow | Record yourself saying the sentence with `expo-audio` |
| Analysis | View a per-word demo score breakdown |
| Pronunciation practice | Drill a single weak word with IPA guidance |
| Progress tab | Weekly stats + **Words to watch** (persistent across restarts) |

---

## Run the app

```bash
npm ci
npx expo start
```

Scan the QR code with **Expo Go** (iOS or Android).  
For a development build or simulator, follow the [Expo docs](https://docs.expo.dev/develop/development-builds/introduction/).

---

## Checks

```bash
npx tsc --noEmit   # type-check — expects no output
npm run lint       # expo lint — expects no output
```

Both commands passed with zero errors at the time of submission.

---

## IBM Bob improvements

These changes were added for the IBM Bob hackathon on top of the existing prototype.

### 1. Persistent weak-word tracking

**Problem:** every analysis result was held only in memory — restarting the app lost all history.

**What was added:**

| File | Change |
|------|--------|
| `src/services/weak-words-storage.ts` | New service. Writes weak-word counts to `AsyncStorage` keyed by word. Deduplicates by `attemptId` so re-renders and screen re-entries never double-count. All I/O errors are caught silently — storage failures cannot crash the app. |
| `src/app/analysis/[id].tsx` | Calls `recordWeakWords(recordingId, result.weakWords)` inside the existing `.then()` chain after analysis completes. One import + one call; no other logic changed. |
| `src/app/(tabs)/progress.tsx` | Adds a **Words to watch** card that loads from `AsyncStorage` on every tab entry. Shows up to 8 words sorted by frequency with a last-score and appearance-count badge (e.g. ×3). Displays an empty state when no analysis has been run yet. Labelled **"Based on demo analysis"** — no claim of real audio evaluation is made. |

**Dependency added:** `@react-native-async-storage/async-storage` via `npx expo install`.

### 2. Sentence / word-group mismatch fix

**Problem:** the mock analysis service matched segments by substring (`includes('medium')`) rather than by sentence. "Hi, can I get a medium latte?" triggered the shopping-lesson branch and displayed the wrong word groups.

**What was fixed (`src/services/mock-speech-analysis.ts`):**

- Segment lookup now uses a four-step priority: exact `sentenceId` → `sentenceId` prefix → exact text (case-insensitive) → generic tokenisation of the actual target text.
- Pre-defined samples are keyed by `sentenceId` (`coffee-1`, `shopping-1`), so two sentences that share the word "medium" always resolve to their own lesson's segments.
- The generic fallback tokenises the text passed in the request, so the word groups and the sentence headline always come from the same source.

---

## How to verify the Bob improvements manually

### Persistent storage

1. Open any lesson → Shadow → record → **Analyze**.
2. Go to the **Progress** tab → scroll to **Words to watch** — words from the analysis appear.
3. Force-quit the app and reopen it.
4. Return to **Progress** → **Words to watch** — the same words and counts are still there.

### Sentence / word-group consistency

| Lesson | Sentence | Expected word groups |
|--------|----------|----------------------|
| Ordering Coffee Naturally | Hi, can I get a medium latte? | Hi, · can I · get a · medium · latte |
| Shopping for Clothes | Excuse me, do you have this in a medium? | Excuse me, · do you have · this · in a · medium |

Both lessons contain the word "medium". After the fix each shows its own lesson's word groups, not the other's.

---

## Limitations

- **Audio recording** uses the device microphone and works on a real device or simulator with microphone access granted.
- **Analysis scores and word ratings are mock data.** The service receives the recording URI but does not process the audio. Scores are generated from a fixed progression table keyed by attempt count. The analysis screen carries the label "AI ANALYSIS PREVIEW · MOCK DATA".
- **Progress tab statistics** (weekly score, session count, situation progress bars) are hard-coded demo values and are not derived from actual usage data.
- The **demo video** bundled in `assets/videos/` is used for all lessons to avoid network access restrictions in Expo Go.

---

## Known gaps / future work

- Replace `RealSpeechAnalysisService` (currently throws) with a real speech-scoring API.
- Source and clear appropriately licensed video content per lesson situation.
- Connect the hard-coded Progress statistics to real session data.

---

## Get started (development)

1. Install dependencies

   ```bash
   npm ci
   ```

2. Start the app

   ```bash
   npx expo start
   ```

Other setup:

- ESLint: `npx expo lint`  
- TypeScript: `npx tsc --noEmit`  
- Unit testing: [Expo Jest guide](https://docs.expo.dev/develop/unit-testing/)
