import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SvgXml } from "react-native-svg";
import { scale, vs } from "react-native-size-matters";

interface EmptyStateProps {
  type: "reels" | "products" | "reviews";
}

const reelSvg = `<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="15" width="60" height="50" rx="8" stroke="#D1D5DB" stroke-width="2" fill="none"/>
  <circle cx="25" cy="30" r="4" stroke="#D1D5DB" stroke-width="1.5" fill="none"/>
  <circle cx="55" cy="30" r="4" stroke="#D1D5DB" stroke-width="1.5" fill="none"/>
  <circle cx="25" cy="50" r="4" stroke="#D1D5DB" stroke-width="1.5" fill="none"/>
  <circle cx="55" cy="50" r="4" stroke="#D1D5DB" stroke-width="1.5" fill="none"/>
  <polygon points="35,32 35,48 48,40" fill="#D1D5DB"/>
</svg>`;

const productSvg = `<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="15" y="25" width="50" height="40" rx="6" stroke="#D1D5DB" stroke-width="2" fill="none"/>
  <path d="M15 35H65" stroke="#D1D5DB" stroke-width="1.5"/>
  <rect x="25" y="15" width="30" height="15" rx="4" stroke="#D1D5DB" stroke-width="2" fill="none"/>
  <circle cx="40" cy="48" r="5" stroke="#D1D5DB" stroke-width="1.5" fill="none"/>
</svg>`;

const reviewSvg = `<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="10" width="60" height="45" rx="8" stroke="#D1D5DB" stroke-width="2" fill="none"/>
  <polygon points="20,65 30,55 40,65" fill="#D1D5DB"/>
  <line x1="22" y1="28" x2="58" y2="28" stroke="#D1D5DB" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="22" y1="36" x2="48" y2="36" stroke="#D1D5DB" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="22" y1="44" x2="38" y2="44" stroke="#D1D5DB" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;

const titles: Record<string, string> = {
  reels: "No reels yet",
  products: "No products yet",
  reviews: "No reviews yet",
};

const subtitles: Record<string, string> = {
  reels: "This brand hasn't posted any reels.",
  products: "This brand hasn't added any products.",
  reviews: "Be the first to review this brand.",
};

const svgs: Record<string, string> = {
  reels: reelSvg,
  products: productSvg,
  reviews: reviewSvg,
};

const EmptyState: React.FC<EmptyStateProps> = ({ type }) => {
  return (
    <View style={styles.container}>
      <SvgXml xml={svgs[type]} width={scale(80)} height={scale(80)} />
      <Text style={styles.title}>{titles[type]}</Text>
      <Text style={styles.subtitle}>{subtitles[type]}</Text>
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: vs(40),
    paddingHorizontal: scale(20),
  },
  title: {
    fontSize: scale(16),
    fontWeight: "600",
    color: "#6B7280",
    fontFamily: "Inter",
    marginTop: vs(16),
  },
  subtitle: {
    fontSize: scale(13),
    fontWeight: "400",
    color: "#9CA3AF",
    fontFamily: "Inter",
    marginTop: vs(6),
    textAlign: "center",
  },
});
