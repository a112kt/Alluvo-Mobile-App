import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../../theme";
import { FILTER_PRESETS, getFilterById } from "../../data/filters";
import type { FilterPreset } from "../../types/reelManagement";

interface FilterOverlayProps {
  activeFilterId: string;
  onSelectFilter?: (filter: FilterPreset) => void;
  visible: boolean;
  readOnly?: boolean;
}

function FilterPreview({
  filter,
  isActive,
  onPress,
}: {
  filter: FilterPreset;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.filterPreviewWrap}>
      <View style={[styles.filterPreview, isActive && styles.filterPreviewActive]}>
        {filter.id === "normal" ? (
          <View style={styles.normalPreview}>
            <Ionicons name="sparkles" size={s(20)} color="#fff" />
          </View>
        ) : (
          <LinearGradient
            colors={filter.overlayColors as [string, string, ...string[]]}
            style={styles.filterGradientPreview}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        )}
        {filter.id !== "normal" && (
          <Ionicons name={filter.icon as any} size={s(16)} color="#fff" style={styles.filterIcon} />
        )}
      </View>
      <Text style={[styles.filterName, isActive && styles.filterNameActive]}>
        {filter.name}
      </Text>
    </Pressable>
  );
}

export default function FilterOverlay({
  activeFilterId,
  onSelectFilter,
  visible,
  readOnly = false,
}: FilterOverlayProps) {
  if (!visible) return null;

  const activeFilter = getFilterById(activeFilterId);

  return (
    <>
      {activeFilter.id !== "normal" && (
        <LinearGradient
          colors={activeFilter.overlayColors as [string, string, ...string[]]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      )}
      {!readOnly && onSelectFilter && (
        <View style={styles.filterStripContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterStrip}
          >
            {FILTER_PRESETS.map((filter) => (
              <FilterPreview
                key={filter.id}
                filter={filter}
                isActive={activeFilterId === filter.id}
                onPress={() => onSelectFilter(filter)}
              />
            ))}
          </ScrollView>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  filterStripContainer: {
    position: "absolute",
    bottom: vs(120),
    left: 0,
    right: 0,
    zIndex: 10,
  },
  filterStrip: {
    paddingHorizontal: s(16),
    gap: s(14),
    alignItems: "center",
  },
  filterPreviewWrap: {
    alignItems: "center",
    gap: vs(6),
  },
  filterPreview: {
    width: s(56),
    height: s(56),
    borderRadius: s(28),
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  filterPreviewActive: {
    borderColor: lightColors.secondary,
    transform: [{ scale: 1.05 }],
    borderWidth: 3,
  },
  normalPreview: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  filterGradientPreview: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: s(28),
  },
  filterIcon: {
    position: "absolute",
    alignSelf: "center",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  filterName: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(11),
    color: "rgba(255,255,255,0.8)",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  filterNameActive: {
    color: lightColors.secondary,
    fontWeight: "700",
  },
});
