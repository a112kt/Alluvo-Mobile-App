# Bug Fix: Video audio cleanup — previewPlayer pause guard

## Problem
`previewPlayer.pause()` throws "Cannot use shared object that was already released" when the native video player has already been cleaned up by expo-video.

## Root Cause
`useVideoPlayer(null)` (when `recordedVideo` is null) creates a player reference backed by an already-released native object. Calling `.pause()` on it crashes. Also, when the component unmounts, React Navigation may release the native player before our cleanup effect runs.

## Fix

**File: `src/features/brand/screens/Reels/RecordReelScreen.tsx`**

Wrap every `previewPlayer.pause()` call in a try-catch to gracefully handle already-released players:

### 1. Unmount cleanup (line 54-64)
```tsx
useEffect(() => {
  return () => {
    if (musicPlayerRef.current) {
      musicPlayerRef.current.pause();
      musicPlayerRef.current.remove();
      musicPlayerRef.current = null;
    }
    try { previewPlayer.pause(); } catch {}
  };
}, []);
```

### 2. handleAccept (line 199)
```tsx
try { previewPlayer.pause(); } catch {}
```

### 3. handleDiscard (line 228)
```tsx
try { previewPlayer.pause(); } catch {}
```

### 4. handleRetake (line 215-216) — already guarded with `if (previewPlayer)` but still needs try-catch
```tsx
try { previewPlayer.pause(); } catch {}
```

## Summary
4 `previewPlayer.pause()` calls need try-catch guards. All in `RecordReelScreen.tsx`. No other files need changes.
