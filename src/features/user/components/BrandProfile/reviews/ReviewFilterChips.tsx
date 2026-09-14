import React from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";
import { scale, vs } from "react-native-size-matters";
import { useTranslation } from "react-i18next";

interface Props {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const FILTERS = [
  { key: "all", labelKey: "all" },
  { key: "recent", labelKey: "mostRecent" },
  { key: "helpful", labelKey: "mostHelpful" },
  { key: "5", label: "5★" },
  { key: "4", label: "4★" },
  { key: "3", label: "3★" },
  { key: "2", label: "2★" },
  { key: "1", label: "1★" },
];

export default function ReviewFilterChips({ activeFilter, onFilterChange }: Props) {
  const { t } = useTranslation();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter.key;
        const label = filter.labelKey ? t(filter.labelKey) : filter.label;
        return (
          <TouchableOpacity
            key={filter.key}
            onPress={() => onFilterChange(filter.key)}
            activeOpacity={0.7}
            style={[styles.chip, isActive && styles.chipActive]}
            accessibilityRole="radio"
            accessibilityState={{ selected: isActive }}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: scale(8),
    paddingHorizontal: scale(4),
    paddingVertical: vs(4),
    marginBottom: vs(8),
  },
  chip: {
    paddingHorizontal: scale(14),
    paddingVertical: vs(8),
    borderRadius: scale(20),
    backgroundColor: "#F3F4F6",
  },
  chipActive: {
    backgroundColor: "#122550",
  },
  chipText: {
    fontSize: scale(12),
    fontWeight: "500",
    color: "#535A65",
    fontFamily: "Inter",
  },
  chipTextActive: {
    color: "#FFFFFF",
  },
});
