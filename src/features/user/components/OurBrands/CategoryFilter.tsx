import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { s, vs, ms, scale } from "react-native-size-matters";

interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  const allOptions = ["All", ...categories];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {allOptions.map((category) => {
        const isSelected =
          category === "All" ? selected === "" : selected === category;
        return (
          <TouchableOpacity
            key={category}
            style={[styles.chip, isSelected && styles.chipSelected]}
            onPress={() => onSelect(category === "All" ? "" : category)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
              {category}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: s(12),
    paddingVertical: vs(14),
    gap: 10,
  },
  chip: {
    height: 38,
    paddingHorizontal: s(20),
    borderRadius: 19,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    marginBottom: 30,
  },
  chipSelected: {
    backgroundColor: "#1B2351",
    borderColor: "#1B2351",
    elevation: 3,
    shadowColor: "#1B2351",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  chipText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
  },
  chipTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
});
