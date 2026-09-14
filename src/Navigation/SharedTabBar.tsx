import React from "react";
import {
  View,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  interpolate,
  Extrapolation,
  type SharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MARGIN_HORIZONTAL = 16;
const TAB_BAR_HEIGHT = 64;
const TAB_BAR_BOTTOM_OFFSET = 16;
const INDICATOR_SIZE = 44;
const ICON_SIZE = 24;
const INACTIVE_OPACITY = 0.6;

const SPRING_CONFIG = {
  damping: 18,
  stiffness: 180,
  mass: 0.7,
};

const SWITCH_MODE_ICON = {
  focused: "swap-horizontal",
  unfocused: "swap-horizontal-outline",
};

function TabButton({
  index,
  activeIndex,
  icons,
  onPress,
  onLongPress,
  badge,
}: {
  index: number;
  activeIndex: SharedValue<number>;
  icons: { focused: string; unfocused: string };
  onPress: () => void;
  onLongPress: () => void;
  badge?: React.ReactNode;
}) {
  const pressScale = useSharedValue(1);

  const rContainerStyle = useAnimatedStyle(() => {
    const scaleFromIndex = interpolate(
      activeIndex.value,
      [index - 1, index, index + 1],
      [1, 1.15, 1],
      Extrapolation.CLAMP
    );
    return {
      opacity: interpolate(
        activeIndex.value,
        [index - 1, index, index + 1],
        [INACTIVE_OPACITY, 1, INACTIVE_OPACITY],
        Extrapolation.CLAMP
      ),
      transform: [{ scale: pressScale.value * scaleFromIndex }],
    };
  });

  const rOutlineStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      activeIndex.value,
      [index - 1, index, index + 1],
      [1, 0, 1],
      Extrapolation.CLAMP
    ),
  }));

  const rFilledStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      activeIndex.value,
      [index - 1, index, index + 1],
      [0, 1, 0],
      Extrapolation.CLAMP
    ),
  }));

  const handlePress = () => {
    pressScale.value = withSequence(
      withTiming(0.88, { duration: 60 }),
      withSpring(1, { damping: 12, stiffness: 200 })
    );
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={onLongPress}
      style={styles.tabButton}
      android_ripple={{ color: "rgba(71, 192, 210, 0.15)", borderless: true, radius: 28 }}
    >
      <Animated.View style={[styles.iconContainer, rContainerStyle]}>
        <View style={styles.iconRow}>
          <View style={styles.iconStack}>
            <Animated.View
              style={[StyleSheet.absoluteFill, styles.iconCentered, rOutlineStyle]}
              pointerEvents="none"
            >
              <Ionicons
                name={icons.unfocused as any}
                size={ICON_SIZE}
                color="#9CA3AF"
              />
            </Animated.View>
            <Animated.View
              style={[StyleSheet.absoluteFill, styles.iconCentered, rFilledStyle]}
              pointerEvents="none"
            >
              <Ionicons
                name={icons.focused as any}
                size={ICON_SIZE}
                color="#FFFFFF"
              />
            </Animated.View>
          </View>
          {badge}
        </View>
      </Animated.View>
    </Pressable>
  );
}

function TabBar({ state, descriptors, navigation, tabIcons, onTabPress }: {
  state: any;
  descriptors: any;
  navigation: any;
  tabIcons: Record<string, { focused: string; unfocused: string }>;
  onTabPress?: (routeName: string) => void;
}) {
  const insets = useSafeAreaInsets();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const TAB_COUNT = state.routes.length;

  const TAB_WIDTH = (SCREEN_WIDTH - MARGIN_HORIZONTAL * 2 - 8) / TAB_COUNT;

  const SLIDE_OUTPUT = Array.from({ length: TAB_COUNT }, (_, i) => {
    const indicatorLeft = 4 + TAB_WIDTH * i + (TAB_WIDTH - INDICATOR_SIZE) / 2;
    return indicatorLeft;
  });

  const activeIndex = useSharedValue(state.index);
  const INDICES = Array.from({ length: TAB_COUNT }, (_, i) => i);

  React.useEffect(() => {
    activeIndex.value = withSpring(state.index, SPRING_CONFIG);
  }, [state.index]);

  const rIndicatorStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateX: interpolate(
            activeIndex.value,
            INDICES,
            SLIDE_OUTPUT
          ),
        },
      ],
    }),
    [SLIDE_OUTPUT, INDICES]
  );

  return (
    <View
      style={[
        styles.container,
        {
          bottom: insets.bottom + TAB_BAR_BOTTOM_OFFSET,
          left: MARGIN_HORIZONTAL,
          right: MARGIN_HORIZONTAL,
        },
      ]}
    >
      <View style={styles.tabBar}>
        <Animated.View style={[styles.indicator, rIndicatorStyle]}>
          <LinearGradient
            colors={["#1B2351", "#47C0D2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.indicatorGradient}
          />
        </Animated.View>

        {state.routes.map((route: any, index: number) => {
          const icons = tabIcons[route.name] || {
            focused: "ellipse",
            unfocused: "ellipse-outline",
          };

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!event.defaultPrevented) {
              navigation.navigate(route.name);
              onTabPress?.(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TabButton
              key={route.key}
              index={index}
              activeIndex={activeIndex}
              icons={icons}
              onPress={onPress}
              onLongPress={onLongPress}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 100,
  },
  tabBar: {
    flexDirection: "row",
    height: TAB_BAR_HEIGHT,
    borderRadius: TAB_BAR_HEIGHT / 2,
    alignItems: "center",
    paddingHorizontal: 4,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    position: "relative",
    zIndex: 2,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconRow: {
    position: "relative",
    width: ICON_SIZE,
    height: ICON_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  iconStack: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  iconCentered: {
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    position: "absolute",
    top: (TAB_BAR_HEIGHT - INDICATOR_SIZE) / 2,
    width: INDICATOR_SIZE,
    height: INDICATOR_SIZE,
    borderRadius: INDICATOR_SIZE / 2,
    overflow: "hidden",
    zIndex: 1,
    shadowColor: "#47C0D2",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  indicatorGradient: {
    width: "100%",
    height: "100%",
  },
});

export {
  MARGIN_HORIZONTAL,
  TAB_BAR_HEIGHT,
  TAB_BAR_BOTTOM_OFFSET,
  INDICATOR_SIZE,
  ICON_SIZE,
  INACTIVE_OPACITY,
  SPRING_CONFIG,
  SWITCH_MODE_ICON,
  TabButton,
  TabBar,
  styles,
};
