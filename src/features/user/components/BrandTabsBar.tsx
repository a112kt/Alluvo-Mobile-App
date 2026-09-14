import React, { useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  LayoutChangeEvent,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { lightColors } from "../../../../theme";
import { scale } from "react-native-size-matters";

type Tab = "reels" | "shop" | "offers" | "reviews" | "Policy";

interface Props {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabIcons: Record<Tab, string> = {
  reels: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`,
  shop: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>`,
  offers: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`,
  reviews: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/><line x1="12" y1="8" x2="12" y2="14"/><line x1="9" y1="11" x2="15" y2="11"/></svg>`,
  Policy: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
};

const TAB_WIDTH = scale(56);

const BrandTabsBar: React.FC<Props> = ({ activeTab, onTabChange }) => {
  const tabs: Tab[] = ["reels", "shop", "offers", "reviews", "Policy"];
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const idx = tabs.indexOf(activeTab);
    Animated.spring(translateX, {
      toValue: idx * TAB_WIDTH,
      useNativeDriver: true,
      friction: 8,
      tension: 60,
    }).start();
  }, [activeTab]);

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.activePill,
            { backgroundColor: lightColors.primary, shadowColor: lightColors.primary, transform: [{ translateX }] },
          ]}
        />
        {tabs.map((key) => {
          const isActive = activeTab === key;
          return (
            <TouchableOpacity
              key={key}
              onPress={() => onTabChange(key)}
              activeOpacity={0.7}
              style={styles.tab}
            >
              <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
                <SvgXml
                  xml={tabIcons[key]}
                  width={scale(18)}
                  height={scale(18)}
                  color={isActive ? lightColors.white : "#9CA3AF"}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default BrandTabsBar;

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: "center",
    marginBottom: scale(12),
  },
  container: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: scale(28),
    padding: scale(4),
    position: "relative",
  },
  activePill: {
    position: "absolute",
    width: TAB_WIDTH,
    height: scale(40),
    borderRadius: scale(20),
    top: scale(4),
    left: scale(4),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  tab: {
    width: TAB_WIDTH,
    height: scale(40),
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapActive: {},
});
