import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import { VideoView, useVideoPlayer } from "expo-video";
import { Ionicons } from "@expo/vector-icons";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../../theme";
import FilterOverlay from "../../components/ReelManagement/FilterOverlay";
import MusicPickerSheet from "../../components/ReelManagement/MusicPickerSheet";
import RecordingControls from "../../components/ReelManagement/RecordingControls";
import { getFilterById } from "../../data/filters";
import { createAudioPlayer } from "expo-audio";
import type { AudioPlayer } from "expo-audio";
import type { FilterPreset, JamendoTrack, ReelRecordingResult } from "../../types/reelManagement";

const MAX_DURATION = 60;

export default function RecordReelScreen({ navigation }: any) {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  const [facing, setFacing] = useState<"back" | "front">("back");
  const [torch, setTorch] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [activeFilter, setActiveFilter] = useState<string>("normal");
  const [showMusic, setShowMusic] = useState(false);
  const [showFilterStrip, setShowFilterStrip] = useState(false);
  const [zoom, setZoom] = useState(0);
  const [selectedTrack, setSelectedTrack] = useState<JamendoTrack | null>(null);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const cameraRef = useRef<CameraView>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingRef = useRef(false);
  const musicPlayerRef = useRef<AudioPlayer | null>(null);

  const previewPlayer = useVideoPlayer(recordedVideo ? { uri: recordedVideo } : null, (player) => {
    player.loop = true;
    player.timeUpdateEventInterval = 0.1; // Check time updates every 100ms
  });

  // Global unmount cleanup — ensures music and video stop no matter how the screen is exited
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

  // Handle selected track player instantiation and lifecycle
  useEffect(() => {
    // Tear down any previous player
    if (musicPlayerRef.current) {
      musicPlayerRef.current.pause();
      musicPlayerRef.current.remove();
      musicPlayerRef.current = null;
    }

    if (selectedTrack) {
      try {
        const player = createAudioPlayer({ uri: selectedTrack.audioUrl });
        player.loop = true;
        musicPlayerRef.current = player;
      } catch (err) {
        console.warn("Failed to initialize audio player for track:", err);
      }
    }
    // No cleanup return here — the global unmount above handles release
  }, [selectedTrack]);

  // Sync music playback with video preview player
  useEffect(() => {
    if (previewPlayer) {
      previewPlayer.muted = !!selectedTrack;
    }
  }, [selectedTrack, previewPlayer, isPreviewMode]);

  // Handle preview player events (playing status and time update loops)
  useEffect(() => {
    if (!previewPlayer) return;

    const playingSub = previewPlayer.addListener("playingChange", (event: any) => {
      const isPlaying = typeof event === "object" ? event.isPlaying : event;
      if (musicPlayerRef.current && isPreviewMode) {
        if (isPlaying) {
          musicPlayerRef.current.play();
        } else {
          musicPlayerRef.current.pause();
        }
      }
    });

    const timeSub = previewPlayer.addListener("timeUpdate", () => {
      // When the video loops (time resets to ~0), seek the music track back to the start
      if (previewPlayer.currentTime < 0.15 && musicPlayerRef.current && isPreviewMode) {
        musicPlayerRef.current.seekTo(0);
      }
    });

    return () => {
      playingSub.remove();
      timeSub.remove();
    };
  }, [previewPlayer, isPreviewMode]);

  const handleStartRecording = useCallback(async () => {
    if (!cameraRef.current || recordingRef.current || !cameraReady) return;
    try {
      recordingRef.current = true;
      setIsRecording(true);
      setTimer(0);

      // Play selected music during recording
      if (musicPlayerRef.current) {
        await musicPlayerRef.current.seekTo(0);
        musicPlayerRef.current.play();
      }

      timerRef.current = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);

      const video = await cameraRef.current.recordAsync({
        maxDuration: MAX_DURATION,
      });

      recordingRef.current = false;
      setIsRecording(false);

      if (musicPlayerRef.current) {
        musicPlayerRef.current.pause();
      }

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (video?.uri) {
        setRecordedVideo(video.uri);
        setIsPreviewMode(true);
      }
    } catch (err) {
      recordingRef.current = false;
      setIsRecording(false);
      if (musicPlayerRef.current) {
        musicPlayerRef.current.pause();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      Alert.alert("Recording failed", "Please try again.");
    }
  }, [cameraReady]);

  const handleStopRecording = useCallback(async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    try {
      await cameraRef.current?.stopRecording();
    } catch {}
    if (musicPlayerRef.current) {
      musicPlayerRef.current.pause();
    }
    setIsRecording(false);
  }, []);

  const handleRecordPress = useCallback(() => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  }, [isRecording, handleStartRecording, handleStopRecording]);

  const handleAccept = useCallback(() => {
    if (!recordedVideo) return;
    if (musicPlayerRef.current) {
      musicPlayerRef.current.pause();
    }
    try { previewPlayer.pause(); } catch {}
    const result: ReelRecordingResult = {
      videoUri: recordedVideo,
      filterId: activeFilter !== "normal" ? activeFilter : undefined,
      musicTrack: selectedTrack
        ? { id: selectedTrack.id, name: selectedTrack.name, artistName: selectedTrack.artistName }
        : undefined,
      duration: timer,
    };
    navigation.navigate("AddReel", { recordingResult: result });
  }, [recordedVideo, activeFilter, selectedTrack, timer, navigation, previewPlayer]);

  const handleRetake = useCallback(() => {
    setRecordedVideo(null);
    setIsPreviewMode(false);
    setTimer(0);
    try { previewPlayer.pause(); } catch {}
    if (musicPlayerRef.current) {
      musicPlayerRef.current.pause();
      musicPlayerRef.current.seekTo(0);
    }
  }, [previewPlayer]);

  const handleDiscard = useCallback(() => {
    if (musicPlayerRef.current) {
      musicPlayerRef.current.pause();
    }
    try { previewPlayer.pause(); } catch {}
    navigation.goBack();
  }, [previewPlayer, navigation]);

  useEffect(() => {
    if (timer >= MAX_DURATION && isRecording) {
      handleStopRecording();
    }
  }, [timer, isRecording, handleStopRecording]);

  useEffect(() => {
    if (recordedVideo && previewPlayer && isPreviewMode) {
      previewPlayer.play();
      if (musicPlayerRef.current) {
        musicPlayerRef.current.seekTo(0);
        musicPlayerRef.current.play();
      }
    }
  }, [recordedVideo, previewPlayer, isPreviewMode]);

  if (!cameraPermission || !microphonePermission) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={lightColors.secondary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!cameraPermission.granted || !microphonePermission.granted) {
    const handleRequestPermissions = async () => {
      const cameraRes = await requestCameraPermission();
      if (cameraRes.granted) {
        await requestMicrophonePermission();
      }
    };

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Ionicons name="camera-outline" size={s(56)} color={lightColors.textInactive} />
          <Text style={styles.permissionTitle}>Camera & Microphone Required</Text>
          <Text style={styles.permissionSub}>
            Allow camera and microphone access to record reels.
          </Text>
          <Pressable style={styles.permissionBtn} onPress={handleRequestPermissions}>
            <Text style={styles.permissionBtnText}>Grant Permission</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      {isPreviewMode && recordedVideo ? (
        <View style={styles.previewContainer}>
          <VideoView
            player={previewPlayer}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            nativeControls={false}
          />
          <FilterOverlay
            activeFilterId={activeFilter}
            onSelectFilter={(f: FilterPreset) => setActiveFilter(f.id)}
            visible={showFilterStrip}
          />
          <RecordingControls
            isRecording={false}
            isPreviewMode={true}
            timerSeconds={timer}
            onRecordPress={() => {}}
            onFlipCamera={() => {}}
            onFlashToggle={() => {}}
            flashMode="off"
            onAccept={handleAccept}
            onRetake={handleRetake}
            onDiscard={handleDiscard}
          />
          {/* Translucent Toolbar Overlay in Preview */}
          <View style={styles.sidebar}>
            <Pressable
              style={[styles.sidebarBtn, showFilterStrip && styles.sidebarBtnActive]}
              onPress={() => setShowFilterStrip((prev) => !prev)}
            >
              <Ionicons name="color-palette-outline" size={s(20)} color="#fff" />
              <Text style={styles.sidebarBtnText}>Filters</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            facing={facing}
            mode="video"
            enableTorch={torch}
            videoQuality="1080p"
            autofocus="on"
            zoom={zoom}
            onCameraReady={() => setCameraReady(true)}
          >
            {/* Snapchat/Instagram Inspired Filter Overlay */}
            <FilterOverlay
              activeFilterId={activeFilter}
              onSelectFilter={(f: FilterPreset) => setActiveFilter(f.id)}
              visible={showFilterStrip}
            />

            {/* Custom On-Screen Zoom Indicators (Quick Zoom Controls) */}
            {!isRecording && (
              <View style={styles.zoomWrapper}>
                <Pressable
                  style={[styles.zoomIndicator, zoom === 0 && styles.zoomIndicatorActive]}
                  onPress={() => setZoom(0)}
                >
                  <Text style={[styles.zoomText, zoom === 0 && styles.zoomTextActive]}>1x</Text>
                </Pressable>
                <Pressable
                  style={[styles.zoomIndicator, zoom === 0.15 && styles.zoomIndicatorActive]}
                  onPress={() => setZoom(0.15)}
                >
                  <Text style={[styles.zoomText, zoom === 0.15 && styles.zoomTextActive]}>2x</Text>
                </Pressable>
                <Pressable
                  style={[styles.zoomIndicator, zoom === 0.3 && styles.zoomIndicatorActive]}
                  onPress={() => setZoom(0.3)}
                >
                  <Text style={[styles.zoomText, zoom === 0.3 && styles.zoomTextActive]}>3x</Text>
                </Pressable>
              </View>
            )}

            {/* Redesigned Recording HUD Bottom Controls */}
            <RecordingControls
              isRecording={isRecording}
              isPreviewMode={false}
              timerSeconds={timer}
              onRecordPress={handleRecordPress}
              onFlipCamera={() => setFacing((f) => (f === "back" ? "front" : "back"))}
              onFlashToggle={() => setTorch((t) => !t)}
              flashMode={torch ? "on" : "off"}
              onAccept={() => {}}
              onRetake={() => {}}
              onDiscard={() => {}}
            />

            {/* Translucent Toolbar Overlay (Sidebar) */}
            {!isRecording && (
              <View style={styles.sidebar}>
                <Pressable
                  style={styles.sidebarBtn}
                  onPress={() => setFacing((f) => (f === "back" ? "front" : "back"))}
                >
                  <Ionicons name="camera-reverse-outline" size={s(20)} color="#fff" />
                  <Text style={styles.sidebarBtnText}>Flip</Text>
                </Pressable>

                <Pressable style={styles.sidebarBtn} onPress={() => setTorch((t) => !t)}>
                  <Ionicons name={torch ? "flash" : "flash-off-outline"} size={s(20)} color="#fff" />
                  <Text style={styles.sidebarBtnText}>Flash</Text>
                </Pressable>

                <Pressable style={styles.sidebarBtn} onPress={() => setShowMusic(true)}>
                  <Ionicons
                    name="musical-note-outline"
                    size={s(20)}
                    color={selectedTrack ? lightColors.secondary : "#fff"}
                  />
                  <Text style={[styles.sidebarBtnText, selectedTrack && { color: lightColors.secondary }]}>
                    {selectedTrack ? "Music" : "Add Music"}
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.sidebarBtn, showFilterStrip && styles.sidebarBtnActive]}
                  onPress={() => setShowFilterStrip((prev) => !prev)}
                >
                  <Ionicons name="color-palette-outline" size={s(20)} color="#fff" />
                  <Text style={styles.sidebarBtnText}>Filters</Text>
                </Pressable>
              </View>
            )}

            {/* Close/Back button in recording screen */}
            {!isRecording && (
              <Pressable style={styles.closeBtn} onPress={handleDiscard}>
                <Ionicons name="close-sharp" size={s(24)} color="#fff" />
              </Pressable>
            )}
          </CameraView>
        </View>
      )}

      {showMusic && (
        <Modal
          visible={showMusic}
          animationType="slide"
          transparent
          onRequestClose={() => setShowMusic(false)}
        >
          <View style={styles.musicModalOverlay}>
            <MusicPickerSheet
              visible={true}
              selectedTrack={selectedTrack}
              onSelectTrack={(track) => setSelectedTrack(track)}
              onClose={() => setShowMusic(false)}
            />
          </View>
        </Modal>
      )}

      {isProcessing && (
        <View style={styles.processingOverlay}>
          <ActivityIndicator size="large" color={lightColors.secondary} />
          <Text style={styles.processingText}>Processing video...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: s(32),
    backgroundColor: lightColors.bgLight,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  processingText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(15),
    color: "#fff",
    marginTop: vs(12),
  },
  permissionTitle: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(18),
    color: lightColors.textTitle,
    marginTop: vs(16),
    textAlign: "center",
  },
  permissionSub: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(13),
    color: lightColors.textSubtitle,
    marginTop: vs(8),
    textAlign: "center",
    lineHeight: s(20),
  },
  permissionBtn: {
    marginTop: vs(24),
    backgroundColor: lightColors.primary,
    paddingHorizontal: s(32),
    paddingVertical: vs(14),
    borderRadius: s(14),
  },
  permissionBtnText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(15),
    color: "#fff",
  },
  sidebar: {
    position: "absolute",
    top: vs(120),
    right: s(12),
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    borderRadius: s(20),
    paddingVertical: vs(10),
    paddingHorizontal: s(6),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    gap: vs(12),
    alignItems: "center",
    zIndex: 10,
  },
  sidebarBtn: {
    width: s(50),
    height: s(50),
    borderRadius: s(25),
    alignItems: "center",
    justifyContent: "center",
    gap: vs(2),
  },
  sidebarBtnActive: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  sidebarBtnText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(9),
    color: "#fff",
    textAlign: "center",
  },
  closeBtn: {
    position: "absolute",
    top: vs(20),
    left: s(16),
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  zoomWrapper: {
    position: "absolute",
    bottom: vs(125),
    alignSelf: "center",
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    borderRadius: s(20),
    padding: s(4),
    gap: s(6),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    zIndex: 10,
  },
  zoomIndicator: {
    width: s(32),
    height: s(32),
    borderRadius: s(16),
    alignItems: "center",
    justifyContent: "center",
  },
  zoomIndicatorActive: {
    backgroundColor: "#fff",
  },
  zoomText: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(11),
    color: "#fff",
  },
  zoomTextActive: {
    color: "#000",
  },
  musicModalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
});
