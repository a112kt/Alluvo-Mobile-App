# Bug Fix: Video audio continues playing after recording reel without music

## Problem

When recording a reel **without music** and tapping "Accept" to go to the AddReel screen, the video audio (recorded by the camera mic) keeps playing. This happens because `previewPlayer` (expo-video) is never paused on navigation or unmount.

## Root Cause

In `RecordReelScreen.tsx`:

1. When `selectedTrack` is null (no music), `previewPlayer.muted` is set to `false` (line 89), so the recorded video plays with its native audio during preview — correct behavior.
2. `handleAccept` (line 193) only pauses `musicPlayerRef.current` (the expo-audio music player), but does **not** pause `previewPlayer`.
3. The unmount cleanup effect (line 54) only cleans up `musicPlayerRef`, not `previewPlayer`.
4. Result: `previewPlayer` keeps playing video+audio even after navigating to AddReelScreen.

## Fix

**File: `src/features/brand/screens/Reels/RecordReelScreen.tsx`**

### 1. Pause previewPlayer in handleAccept (line ~195)

Add `previewPlayer.pause()` before navigating:

```tsx
const handleAccept = useCallback(() => {
  if (!recordedVideo) return;
  if (musicPlayerRef.current) {
    musicPlayerRef.current.pause();
  }
  previewPlayer.pause();  // <-- ADD THIS
  // ... rest of navigate logic
}, [...]);
```

### 2. Pause previewPlayer in handleDiscard (line ~222)

Add `previewPlayer.pause()` before navigating back:

```tsx
const handleDiscard = useCallback(() => {
  if (musicPlayerRef.current) {
    musicPlayerRef.current.pause();
  }
  previewPlayer.pause();  // <-- ADD THIS
  navigation.goBack();
}, [previewPlayer, navigation]);
```

### 3. Pause previewPlayer in handleRetake (line ~209)

Already handled — `previewPlayer.pause()` is called at line 213-215. No change needed.

### 4. Add previewPlayer cleanup to unmount effect (line ~54)

```tsx
useEffect(() => {
  return () => {
    if (musicPlayerRef.current) {
      musicPlayerRef.current.pause();
      musicPlayerRef.current.remove();
      musicPlayerRef.current = null;
    }
    previewPlayer.pause();  // <-- ADD THIS
  };
}, []);
```

### 5. Add previewPlayer to handleAccept dependencies

Since `previewPlayer` is now used in `handleAccept`, add it to the dependency array.

## Summary of Changes

| Location | Change |
|----------|--------|
| `handleAccept` | Add `previewPlayer.pause()` before navigation, add `previewPlayer` to deps |
| `handleDiscard` | Add `previewPlayer.pause()` before `goBack()`, add `previewPlayer` to deps |
| Unmount effect | Add `previewPlayer.pause()` cleanup |

All changes are in `RecordReelScreen.tsx`. No other files need modification.
