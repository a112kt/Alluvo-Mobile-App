import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../../theme";
import { useJamendoTracks } from "../../hooks/useJamendoTracks";
import { createAudioPlayer } from "expo-audio";
import type { AudioPlayer } from "expo-audio";
import type { JamendoTrack } from "../../types/reelManagement";

interface MusicPickerSheetProps {
  visible: boolean;
  selectedTrack: JamendoTrack | null;
  onSelectTrack: (track: JamendoTrack | null) => void;
  onClose: () => void;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s_ = Math.floor(seconds % 60);
  return `${m}:${s_.toString().padStart(2, "0")}`;
}

export default function MusicPickerSheet({
  visible,
  selectedTrack,
  onSelectTrack,
  onClose,
}: MusicPickerSheetProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const playerRef = useRef<AudioPlayer | null>(null);

  const { data: tracks, isLoading } = useJamendoTracks(
    debouncedSearch || undefined
  );

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.pause();
        playerRef.current.remove();
        playerRef.current = null;
      }
    };
  }, []);

  const handlePreview = async (track: JamendoTrack) => {
    try {
      if (previewingId === track.id) {
        if (playerRef.current) {
          playerRef.current.pause();
          playerRef.current.remove();
          playerRef.current = null;
        }
        setPreviewingId(null);
        return;
      }

      if (playerRef.current) {
        playerRef.current.pause();
        playerRef.current.remove();
        playerRef.current = null;
      }

      const player = createAudioPlayer({ uri: track.audioUrl });
      playerRef.current = player;
      setPreviewingId(track.id);

      player.addListener("playbackStatusUpdate", (status) => {
        if (status && status.didJustFinish) {
          setPreviewingId(null);
          player.pause();
          player.remove();
          if (playerRef.current === player) {
            playerRef.current = null;
          }
        }
      });

      player.play();
    } catch (err) {
      console.warn("Audio preview failed:", err);
      setPreviewingId(null);
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.handle} />
      <View style={styles.header}>
        <Text style={styles.title}>Add Music</Text>
        <Pressable onPress={onClose} style={styles.closeBtn}>
          <Ionicons name="close" size={s(22)} color={lightColors.textTitle} />
        </Pressable>
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={s(18)} color={lightColors.textHint} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search tracks..."
          placeholderTextColor={lightColors.textHint}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <Pressable
        style={styles.noMusicRow}
        onPress={() => {
          onSelectTrack(null);
          onClose();
        }}
      >
        <View style={styles.noMusicIcon}>
          <Ionicons name="musical-note-outline" size={s(22)} color={lightColors.textHint} />
        </View>
        <Text style={[styles.noMusicText, !selectedTrack && styles.selectedText]}>
          No Music
        </Text>
        {!selectedTrack && (
          <Ionicons name="checkmark" size={s(20)} color={lightColors.secondary} />
        )}
      </Pressable>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={lightColors.secondary}
            style={{ marginTop: vs(20) }}
          />
        ) : !tracks || tracks.length === 0 ? (
          <Text style={styles.emptyText}>
            {debouncedSearch ? "No tracks found" : "Enter a Jamendo API key in .env to load music"}
          </Text>
        ) : (
          tracks.map((track) => {
            const isSelected = selectedTrack?.id === track.id;
            const isPreviewing = previewingId === track.id;
            return (
              <Pressable
                key={track.id}
                style={styles.trackRow}
                onPress={() => {
                  onSelectTrack(track);
                  onClose();
                }}
              >
                <Image
                  source={{ uri: track.imageUrl }}
                  style={styles.trackImage}
                  defaultSource={undefined}
                />
                <View style={styles.trackInfo}>
                  <Text style={styles.trackName} numberOfLines={1}>
                    {track.name}
                  </Text>
                  <Text style={styles.trackArtist} numberOfLines={1}>
                    {track.artistName} · {formatDuration(track.duration)}
                  </Text>
                </View>
                <Pressable
                  style={styles.previewBtn}
                  onPress={() => handlePreview(track)}
                >
                  <Ionicons
                    name={isPreviewing ? "stop-circle" : "play-circle"}
                    size={s(28)}
                    color={isPreviewing ? lightColors.textDanger : lightColors.secondary}
                  />
                </Pressable>
                {isSelected && (
                  <Ionicons
                    name="checkmark-circle"
                    size={s(20)}
                    color={lightColors.secondary}
                    style={{ marginLeft: s(4) }}
                  />
                )}
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.white,
    borderTopLeftRadius: s(20),
    borderTopRightRadius: s(20),
    paddingTop: vs(12),
  },
  handle: {
    width: s(36),
    height: vs(4),
    borderRadius: s(2),
    backgroundColor: lightColors.bgHeavy,
    alignSelf: "center",
    marginBottom: vs(8),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: s(20),
    marginBottom: vs(12),
  },
  title: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(18),
    color: lightColors.textTitle,
  },
  closeBtn: {
    width: s(32),
    height: s(32),
    borderRadius: s(16),
    backgroundColor: lightColors.bgLight,
    alignItems: "center",
    justifyContent: "center",
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: lightColors.bgLight,
    borderRadius: s(12),
    marginHorizontal: s(20),
    paddingHorizontal: s(12),
    height: vs(40),
    marginBottom: vs(8),
  },
  searchInput: {
    flex: 1,
    fontFamily: "Inter",
    fontSize: s(14),
    color: lightColors.textTitle,
    marginLeft: s(8),
  },
  noMusicRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: s(20),
    paddingVertical: vs(12),
    borderBottomWidth: 1,
    borderBottomColor: lightColors.separator,
  },
  noMusicIcon: {
    width: s(40),
    height: s(40),
    borderRadius: s(10),
    backgroundColor: lightColors.bgLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: s(12),
  },
  noMusicText: {
    flex: 1,
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: s(15),
    color: lightColors.textTitle,
  },
  selectedText: {
    color: lightColors.secondary,
    fontWeight: "600",
  },
  list: {
    flex: 1,
    paddingHorizontal: s(20),
  },
  emptyText: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(13),
    color: lightColors.textHint,
    textAlign: "center",
    marginTop: vs(32),
  },
  trackRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: vs(10),
    borderBottomWidth: 1,
    borderBottomColor: lightColors.bgLight,
  },
  trackImage: {
    width: s(40),
    height: s(40),
    borderRadius: s(8),
    backgroundColor: lightColors.bgLight,
    marginRight: s(12),
  },
  trackInfo: {
    flex: 1,
    marginRight: s(8),
  },
  trackName: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(14),
    color: lightColors.textTitle,
  },
  trackArtist: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(11),
    color: lightColors.textSubtitle,
    marginTop: vs(2),
  },
  previewBtn: {
    padding: s(4),
  },
});
