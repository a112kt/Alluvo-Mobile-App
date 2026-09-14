# Reel Recording Feature — Plan

## Objective
Add in-app reel recording (brand-facing) with camera, real-time filter overlays, and Jamendo API music integration to the ALLUVO mobile app.

## Architecture

```
ReelsListScreen
    │
    └── (+) New Reel ──> [Record] ──> RecordReelScreen ──> AddReelScreen
                    (camera + filters +    │                  (pre-filled
                     music + preview)      │                   with video)
                              ├────────────┼────────────┐
                              │            │            │
                         Camera        Filter       Music (Jamendo)
                         Preview      Overlay        Player
```

## Files to Create

### 1. `src/features/brand/data/filters.ts`
- 8 filter preset definitions (Normal, Warm, Cool, Vintage, Noir, Bright, Dramatic, Dreamy)
- Each: `{ id, name, icon, overlayColors[], overlayOpacity }`

### 2. `src/features/brand/services/jamendo.ts` (NEW — was not in original plan)
- `fetchJamendoTracks(search?: string, limit?: number)` — calls `GET https://api.jamendo.com/v3.0/tracks/`
- `fetchJamendoTrackPreview(trackId)` — gets audio URL for preview
- Config: `JAMENDO_CLIENT_ID` from env (user registers at devportal.jamendo.com)

### 3. `src/features/brand/hooks/useJamendoTracks.ts` (NEW)
- React Query hook wrapping `fetchJamendoTracks`
- Query key: `["jamendo-tracks", search]`
- Stale time: 5 minutes (tracks don't change often)

### 4. `src/features/brand/components/ReelManagement/FilterOverlay.tsx`
- Horizontal scrollable filter strip with preview thumbnails
- Active filter indicator
- Uses `expo-linear-gradient` to render color overlay
- Receives `activeFilter: FilterPreset`, renders gradient on top of camera/video

### 5. `src/features/brand/components/ReelManagement/MusicPickerSheet.tsx`
- Bottom sheet with search bar + track list from Jamendo API
- Each track row: album art, track name, artist, duration, preview play button
- "No Music" option at top
- Uses `expo-av` `Audio.Sound` for 30-second preview playback
- Selected track highlighted with checkmark

### 6. `src/features/brand/components/ReelManagement/RecordingControls.tsx`
- Animated record button (Reanimated spring + pulse)
- Timer (MM:SS format)
- Flip camera icon button
- Flash toggle icon button
- Delete/retake button (in preview mode)

### 7. `src/features/brand/screens/Reels/RecordReelScreen.tsx`
Main screen — three modes:

**Mode 1: Recording**
- `<CameraView>` from expo-camera with `mode="video"`
- Filter overlay on top of camera
- RecordingControls (record button, timer, flip, flash)
- Filter strip at bottom
- Music indicator (if track selected)
- Max recording duration: 60 seconds

**Mode 2: Preview**
- Video playback with `expo-video` `VideoView`
- Same filter overlay applied
- Same music track playing
- "Use Video" button → navigates to AddReelScreen with params
- "Retake" button → back to recording
- "Discard" → back to list

**Mode 3: Permissions** — shows permission request UI if not granted

### 8. Extend `src/features/brand/types/reelManagement.ts`
Add types:
```ts
export interface FilterPreset { ... }
export interface MusicTrackInfo { id, name, artist, duration, audioUrl, imageUrl }
export interface ReelRecordingResult { videoUri, filterId, musicTrack, duration }
export interface FilterPreset { ... }
```

## Existing Files to Modify

### 9. `src/features/brand/screens/Reels/AddReelScreen.tsx`
- Accept optional `recordingResult` navigation params
- If present, pre-fill video from recording URI (instead of gallery pick)
- Otherwise show existing upload flow (gallery pick)

### 10. `src/features/brand/navigation/BrandRootStack.tsx`
- Add `RecordReel` screen to stack navigator
- Update navigation types

### 11. `src/features/brand/navigation/BrandTabs.tsx`
- Update Reels tab to point to `ReelsListScreen` (from previous CRUD plan)

### 12. `app.json`
- Add expo-camera plugin with permission strings

### 13. `.env`
- Add `EXPO_PUBLIC_JAMENDO_CLIENT_ID=<api_key>`

## API Integration

### Jamendo API
- Register at https://devportal.jamendo.com/ for free API key
- Endpoint: `https://api.jamendo.com/v3.0/tracks/`
- Params: `client_id`, `format=json`, `limit=20`, `tags=instrumental`, `search=`
- Returns: tracks with `id`, `name`, `artist_name`, `duration`, `audio` (preview URL), `album_image`
- Used for: browsing tracks, preview playback
- Stored with reel: `{ jamendoTrackId, trackName, artistName }`

### Backend Reel Recording Endpoints
The existing backend endpoints are sufficient:
- `POST /ReelManagement` — upload with FormData (title, video, status, productIds)
- Add optional fields: `FilterId`, `MusicTrackId`, `MusicTrackName`, `MusicTrackArtist`

## Dependencies (No new npm packages)
| Library | Version | Used For |
|---------|---------|----------|
| expo-camera | ~17.0.8 | Camera + video recording |
| expo-av | ~16.0.7 | Jamendo music preview playback |
| expo-linear-gradient | ~15.0.8 | Filter overlays |
| react-native-reanimated | ~4.1.1 | Record button animation, filter transitions |
| expo-video | ~3.0.16 | Recording preview playback |
| expo-file-system | ~19.0.17 | Temp file handling |

## Implementation Order
1. types/reelManagement.ts — add recording types
2. data/filters.ts — filter presets
3. services/jamendo.ts — Jamendo API service
4. hooks/useJamendoTracks.ts — React Query hook
5. components/ReelManagement/FilterOverlay.tsx
6. components/ReelManagement/MusicPickerSheet.tsx
7. components/ReelManagement/RecordingControls.tsx
8. screens/Reels/RecordReelScreen.tsx
9. Update AddReelScreen to accept recording result
10. Update BrandRootStack navigation
11. Update app.json plugins
12. Update .env with Jamendo client ID (user provides the key)
