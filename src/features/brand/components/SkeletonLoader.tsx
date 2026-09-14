import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Easing, Text } from "react-native";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../theme";

export function FadeInView({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: any;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 400, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}

export function ShimmerBlock({
  width,
  height,
  borderRadius = s(8),
  flex,
  style,
}: {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  flex?: number;
  style?: any;
}) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.85,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: lightColors.bgHeavy,
          opacity,
          flex,
        },
        style,
      ]}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <View style={styles.statCard}>
      <ShimmerBlock width={s(36)} height={s(36)} borderRadius={s(10)} />
      <ShimmerBlock
        width={s(70)}
        height={s(22)}
        borderRadius={s(4)}
        style={{ marginTop: vs(12) }}
      />
      <ShimmerBlock
        width={s(90)}
        height={s(14)}
        borderRadius={s(4)}
        style={{ marginTop: vs(6) }}
      />
    </View>
  );
}

export function GreetingSkeleton() {
  return (
    <View style={styles.greetingSection}>
      <ShimmerBlock width={s(120)} height={s(16)} borderRadius={s(4)} />
      <ShimmerBlock
        width={s(180)}
        height={s(26)}
        borderRadius={s(6)}
        style={{ marginTop: vs(6) }}
      />
      <ShimmerBlock
        width={s(200)}
        height={s(14)}
        borderRadius={s(4)}
        style={{ marginTop: vs(8) }}
      />
    </View>
  );
}

export function AnalyticsRowSkeleton() {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <ShimmerBlock width={s(130)} height={s(18)} borderRadius={s(4)} />
        <ShimmerBlock width={s(80)} height={s(16)} borderRadius={s(4)} />
      </View>
      <View style={styles.analyticsRow}>
        {[1, 2, 3].map((i) => (
          <View key={i} style={styles.analyticsItem}>
            <ShimmerBlock width={s(22)} height={s(22)} borderRadius={s(6)} />
            <ShimmerBlock
              width={s(50)}
              height={s(20)}
              borderRadius={s(4)}
              style={{ marginTop: vs(6) }}
            />
            <ShimmerBlock
              width={s(60)}
              height={s(12)}
              borderRadius={s(4)}
              style={{ marginTop: vs(4) }}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

export function SectionCardSkeleton({ height = vs(160) }: { height?: number }) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <ShimmerBlock width={s(130)} height={s(18)} borderRadius={s(4)} />
        <ShimmerBlock width={s(50)} height={s(16)} borderRadius={s(4)} />
      </View>
      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.rowItem}>
          <ShimmerBlock width={s(36)} height={s(36)} borderRadius={s(18)} />
          <View style={{ flex: 1, marginLeft: s(10) }}>
            <ShimmerBlock width="70%" height={s(14)} borderRadius={s(4)} />
            <ShimmerBlock
              width="40%"
              height={s(11)}
              borderRadius={s(4)}
              style={{ marginTop: vs(4) }}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

export function DashboardSkeleton() {
  return (
    <View style={styles.container}>
      <GreetingSkeleton />
      <View style={styles.statGrid}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <View key={i} style={styles.statCol}>
            <StatCardSkeleton />
          </View>
        ))}
      </View>
      <AnalyticsRowSkeleton />
      <SectionCardSkeleton height={vs(160)} />
      <SectionCardSkeleton height={vs(160)} />
    </View>
  );
}

export function ProfileSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={{ flex: 1 }}>
          <ShimmerBlock width={s(80)} height={s(14)} borderRadius={s(4)} />
          <ShimmerBlock
            width={s(160)}
            height={s(22)}
            borderRadius={s(6)}
            style={{ marginTop: vs(4) }}
          />
        </View>
        <ShimmerBlock width={s(64)} height={s(32)} borderRadius={s(10)} />
      </View>
      <ShimmerBlock width="100%" height={vs(180)} borderRadius={s(20)} />
      <ShimmerBlock
        width="100%"
        height={vs(80)}
        borderRadius={s(16)}
        style={{ marginTop: vs(12) }}
      />
      <View style={styles.statsRow}>
        {[1, 2, 3].map((i) => (
          <ShimmerBlock key={i} flex={1} height={vs(80)} borderRadius={s(16)} style={{ marginHorizontal: s(4) }} />
        ))}
      </View>
      <ShimmerBlock
        width="100%"
        height={vs(100)}
        borderRadius={s(20)}
        style={{ marginTop: vs(12) }}
      />
      <ShimmerBlock
        width="100%"
        height={vs(60)}
        borderRadius={s(20)}
        style={{ marginTop: vs(12) }}
      />
      <ShimmerBlock
        width="100%"
        height={vs(160)}
        borderRadius={s(20)}
        style={{ marginTop: vs(12) }}
      />
    </View>
  );
}

export function ReelGridSkeleton() {
  return (
    <View style={styles.reelGrid}>
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={styles.reelCol}>
          <ShimmerBlock width="100%" height={vs(220)} borderRadius={s(14)} />
          <ShimmerBlock
            width="80%"
            height={s(14)}
            borderRadius={s(4)}
            style={{ marginTop: vs(8), alignSelf: "center" }}
          />
        </View>
      ))}
    </View>
  );
}

export function ReelsListSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.skeletonHeader}>
        <ShimmerBlock width={s(150)} height={s(28)} borderRadius={s(6)} />
        <ShimmerBlock width={s(44)} height={s(44)} borderRadius={s(22)} />
      </View>

      <View style={styles.reelActions}>
        <ShimmerBlock flex={1} height={vs(48)} borderRadius={s(16)} style={{ marginRight: s(6) }} />
        <ShimmerBlock flex={1} height={vs(48)} borderRadius={s(16)} style={{ marginLeft: s(6) }} />
      </View>

      <ShimmerBlock width="100%" height={vs(48)} borderRadius={s(16)} style={{ marginBottom: vs(20) }} />

      <View style={styles.filterRow}>
        {[1, 2, 3].map((i) => (
          <ShimmerBlock key={i} width={s(90)} height={vs(36)} borderRadius={s(20)} />
        ))}
      </View>

      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.verticalCardSkeleton}>
          <ShimmerBlock width="100%" height={vs(190)} borderRadius={s(0)} />
          <View style={styles.verticalCardContent}>
            <ShimmerBlock width="75%" height={s(16)} borderRadius={s(4)} />
            <ShimmerBlock width="30%" height={s(11)} borderRadius={s(4)} style={{ marginTop: vs(6) }} />
            <ShimmerBlock width={s(72)} height={s(22)} borderRadius={s(12)} style={{ marginTop: vs(10) }} />
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: vs(12) }}>
              <ShimmerBlock width={s(48)} height={s(14)} borderRadius={s(4)} />
              <ShimmerBlock width={s(44)} height={s(14)} borderRadius={s(4)} />
              <ShimmerBlock width={s(56)} height={s(14)} borderRadius={s(4)} />
              <ShimmerBlock width={s(42)} height={s(14)} borderRadius={s(4)} />
            </View>
            <ShimmerBlock width="100%" height={1} borderRadius={0} style={{ marginTop: vs(12), marginBottom: vs(10) }} />
            <View style={{ flexDirection: "row" }}>
              <ShimmerBlock flex={1} height={s(28)} borderRadius={s(10)} />
              <ShimmerBlock flex={1} height={s(28)} borderRadius={s(10)} style={{ marginHorizontal: s(8) }} />
              <ShimmerBlock flex={1} height={s(28)} borderRadius={s(10)} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

export function AnalyticsOverviewSkeleton() {
  return (
    <View style={styles.overviewScroll}>
      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.overviewCard}>
          <ShimmerBlock width={s(36)} height={s(36)} borderRadius={s(12)} />
          <ShimmerBlock
            width={s(70)}
            height={s(22)}
            borderRadius={s(4)}
            style={{ marginTop: vs(12) }}
          />
          <ShimmerBlock
            width={s(50)}
            height={s(12)}
            borderRadius={s(4)}
            style={{ marginTop: vs(6) }}
          />
        </View>
      ))}
    </View>
  );
}

export function AnalyticsSectionSkeleton() {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <ShimmerBlock width={s(150)} height={s(18)} borderRadius={s(4)} />
      </View>
      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.analyticsBarRow}>
          <View style={styles.barLabel}>
            <ShimmerBlock width={s(8)} height={s(8)} borderRadius={s(4)} />
            <ShimmerBlock width={s(60)} height={s(12)} borderRadius={s(4)} style={{ marginLeft: s(6) }} />
          </View>
          <ShimmerBlock flex={1} height={vs(8)} borderRadius={s(4)} style={{ marginHorizontal: s(10) }} />
          <ShimmerBlock width={s(30)} height={s(12)} borderRadius={s(4)} />
        </View>
      ))}
    </View>
  );
}

export function ChartSkeleton() {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <ShimmerBlock width={s(170)} height={s(18)} borderRadius={s(4)} />
      </View>
      <View style={styles.chartRow}>
        <ShimmerBlock width={s(60)} height={vs(30)} borderRadius={s(6)} />
        <ShimmerBlock width={s(60)} height={vs(30)} borderRadius={s(6)} />
        <ShimmerBlock width={s(60)} height={vs(30)} borderRadius={s(6)} />
      </View>
      <View style={styles.chartContent}>
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <ShimmerBlock
            key={i}
            width={s(24)}
            height={[80, 120, 60, 140, 90, 110, 50][i - 1]}
            borderRadius={s(6)}
          />
        ))}
      </View>
    </View>
  );
}

export function ReelAnalyticsSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.analyticsHeader}>
        <ShimmerBlock width={s(40)} height={s(40)} borderRadius={s(12)} />
        <View style={{ alignItems: "center" }}>
          <ShimmerBlock width={s(130)} height={s(18)} borderRadius={s(4)} />
          <ShimmerBlock
            width={s(180)}
            height={s(12)}
            borderRadius={s(4)}
            style={{ marginTop: vs(4) }}
          />
        </View>
        <ShimmerBlock width={s(40)} height={s(40)} borderRadius={s(12)} />
      </View>
      <AnalyticsOverviewSkeleton />
      <AnalyticsSectionSkeleton />
      <AnalyticsSectionSkeleton />
      <ChartSkeleton />
      <SectionCardSkeleton height={vs(180)} />
    </View>
  );
}

export function ReelDetailSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.simpleHeader}>
        <ShimmerBlock width={s(40)} height={s(40)} borderRadius={s(12)} />
        <ShimmerBlock width={s(100)} height={s(18)} borderRadius={s(4)} />
        <ShimmerBlock width={s(40)} height={s(40)} borderRadius={s(12)} />
      </View>
      <ShimmerBlock width="100%" height={vs(400)} borderRadius={s(0)} />
      <View style={{ padding: s(20) }}>
        <ShimmerBlock width="70%" height={s(20)} borderRadius={s(4)} />
        <ShimmerBlock
          width={s(80)}
          height={s(22)}
          borderRadius={s(8)}
          style={{ marginTop: vs(10) }}
        />
        <View style={styles.statsInline}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={{ flex: 1, alignItems: "center" }}>
              <ShimmerBlock width={s(24)} height={s(24)} borderRadius={s(6)} />
              <ShimmerBlock
                width={s(40)}
                height={s(18)}
                borderRadius={s(4)}
                style={{ marginTop: vs(6) }}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export function EditReelSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.simpleHeader}>
        <ShimmerBlock width={s(40)} height={s(40)} borderRadius={s(12)} />
        <ShimmerBlock width={s(120)} height={s(18)} borderRadius={s(4)} />
        <ShimmerBlock width={s(40)} height={s(40)} borderRadius={s(12)} />
      </View>
      <ShimmerBlock width="100%" height={vs(300)} borderRadius={s(0)} />
      <View style={{ padding: s(20) }}>
        <ShimmerBlock width={s(40)} height={s(14)} borderRadius={s(4)} />
        <ShimmerBlock
          width="100%"
          height={vs(44)}
          borderRadius={s(12)}
          style={{ marginTop: vs(8) }}
        />
        <ShimmerBlock
          width={s(60)}
          height={s(14)}
          borderRadius={s(4)}
          style={{ marginTop: vs(20) }}
        />
        <ShimmerBlock
          width="100%"
          height={vs(48)}
          borderRadius={s(12)}
          style={{ marginTop: vs(8) }}
        />
        <View style={styles.actionRow}>
          <ShimmerBlock flex={1} height={vs(48)} borderRadius={s(14)} style={{ marginRight: s(5) }} />
          <ShimmerBlock flex={1} height={vs(48)} borderRadius={s(14)} style={{ marginLeft: s(5) }} />
        </View>
      </View>
    </View>
  );
}

export function AddReelSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.simpleHeader}>
        <ShimmerBlock width={s(40)} height={s(40)} borderRadius={s(12)} />
        <ShimmerBlock width={s(100)} height={s(18)} borderRadius={s(4)} />
        <ShimmerBlock width={s(40)} height={s(40)} borderRadius={s(12)} />
      </View>
      <View style={{ alignItems: "center", marginVertical: vs(12) }}>
        <ShimmerBlock width={s(160)} height={vs(200)} borderRadius={s(14)} />
      </View>
      <View style={{ paddingHorizontal: s(20) }}>
        <ShimmerBlock width={s(40)} height={s(14)} borderRadius={s(4)} />
        <ShimmerBlock
          width="100%"
          height={vs(44)}
          borderRadius={s(12)}
          style={{ marginTop: vs(8) }}
        />
        <ShimmerBlock
          width={s(60)}
          height={s(14)}
          borderRadius={s(4)}
          style={{ marginTop: vs(16) }}
        />
        <ShimmerBlock
          width="100%"
          height={vs(48)}
          borderRadius={s(12)}
          style={{ marginTop: vs(8) }}
        />
        <ShimmerBlock
          width="100%"
          height={vs(48)}
          borderRadius={s(14)}
          style={{ marginTop: vs(16) }}
        />
      </View>
    </View>
  );
}

export function ConversationSkeleton() {
  return (
    <View style={styles.conversationRow}>
      <ShimmerBlock width={s(48)} height={s(48)} borderRadius={s(24)} />
      <View style={styles.conversationContent}>
        <View style={styles.conversationTopRow}>
          <ShimmerBlock width="55%" height={s(14)} borderRadius={s(4)} />
          <ShimmerBlock width={s(36)} height={s(12)} borderRadius={s(4)} />
        </View>
        <ShimmerBlock width="75%" height={s(12)} borderRadius={s(4)} style={{ marginTop: vs(6) }} />
      </View>
    </View>
  );
}

export function ChatSkeleton() {
  return (
    <View style={styles.chatContainer}>
      <View style={styles.chatHeader}>
        <ShimmerBlock width={s(40)} height={s(40)} borderRadius={s(12)} />
        <ShimmerBlock width={s(36)} height={s(36)} borderRadius={s(18)} />
        <View style={{ flex: 1, marginLeft: s(10) }}>
          <ShimmerBlock width={s(120)} height={s(14)} borderRadius={s(4)} />
          <ShimmerBlock width={s(50)} height={s(10)} borderRadius={s(4)} style={{ marginTop: vs(4) }} />
        </View>
      </View>
      <View style={styles.chatMessages}>
        {[1, 2, 3, 4, 5].map((i) => {
          const isMine = i % 3 === 0;
          return (
            <View
              key={i}
              style={[
                styles.chatBubbleRow,
                isMine ? styles.chatBubbleRowRight : styles.chatBubbleRowLeft,
              ]}
            >
              {!isMine && (
                <ShimmerBlock width={s(30)} height={s(30)} borderRadius={s(15)} />
              )}
              <View
                style={[
                  styles.chatBubbleSkeleton,
                  isMine ? styles.chatBubbleRight : styles.chatBubbleLeft,
                ]}
              >
                <ShimmerBlock
                  width={`${50 + (i * 7) % 30}%` as any}
                  height={s(14)}
                  borderRadius={s(4)}
                />
              </View>
            </View>
          );
        })}
      </View>
      <View style={styles.chatInputBar}>
        <ShimmerBlock flex={1} height={vs(40)} borderRadius={s(20)} />
        <ShimmerBlock width={s(42)} height={s(42)} borderRadius={s(21)} style={{ marginLeft: s(8) }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: s(20),
    paddingTop: vs(8),
  },
  greetingSection: {
    marginBottom: vs(24),
  },
  statCard: {
    flex: 1,
    backgroundColor: lightColors.white,
    borderRadius: s(16),
    padding: s(16),
    marginHorizontal: s(4),
    marginBottom: vs(12),
    minHeight: vs(120),
  },
  statGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: s(-4),
    marginBottom: vs(8),
  },
  statCol: {
    width: "50%",
  },
  sectionCard: {
    backgroundColor: lightColors.white,
    borderRadius: s(20),
    padding: s(20),
    marginBottom: vs(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: vs(16),
  },
  analyticsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: vs(8),
  },
  analyticsItem: {
    alignItems: "center",
    flex: 1,
  },
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: lightColors.white,
    borderRadius: s(12),
    padding: s(12),
    marginBottom: vs(8),
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: vs(16),
  },
  statsRow: {
    flexDirection: "row",
    marginTop: vs(12),
  },
  reelGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: s(10),
    marginTop: vs(8),
  },
  reelCol: {
    width: "47%",
  },
  skeletonHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: vs(8),
    paddingBottom: vs(12),
  },
  reelCardSkeleton: {
    flexDirection: "row",
    height: vs(170),
    backgroundColor: lightColors.white,
    borderRadius: s(20),
    overflow: "hidden",
    marginBottom: vs(14),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  reelCardContent: {
    flex: 1,
    padding: s(14),
    justifyContent: "space-between",
  },
  verticalCardSkeleton: {
    backgroundColor: lightColors.white,
    borderRadius: s(20),
    overflow: "hidden",
    marginBottom: vs(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  verticalCardContent: {
    padding: s(16),
  },
  reelActions: {
    flexDirection: "row",
    marginTop: vs(12),
    marginBottom: vs(16),
  },
  filterRow: {
    flexDirection: "row",
    gap: s(8),
    marginTop: vs(8),
    marginBottom: vs(4),
  },
  overviewScroll: {
    flexDirection: "row",
    gap: s(10),
    marginBottom: vs(16),
  },
  overviewCard: {
    width: s(150),
    backgroundColor: lightColors.white,
    borderRadius: s(20),
    padding: s(18),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  analyticsBarRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: vs(10),
  },
  barLabel: {
    flexDirection: "row",
    alignItems: "center",
    width: s(90),
  },
  chartRow: {
    flexDirection: "row",
    gap: s(8),
    marginBottom: vs(12),
  },
  chartContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 180,
    paddingTop: vs(20),
    marginTop: vs(8),
  },
  analyticsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: vs(12),
  },
  simpleHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: vs(12),
  },
  statsInline: {
    flexDirection: "row",
    paddingVertical: vs(16),
    marginTop: vs(16),
  },
  actionRow: {
    flexDirection: "row",
    marginTop: vs(20),
  },
  conversationRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: vs(12),
    paddingHorizontal: s(12),
  },
  conversationContent: {
    flex: 1,
    marginHorizontal: s(14),
  },
  conversationTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatContainer: {
    flex: 1,
    backgroundColor: lightColors.bgLight,
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: s(16),
    paddingVertical: vs(12),
    borderBottomWidth: 1,
    borderBottomColor: lightColors.separator,
    backgroundColor: lightColors.white,
  },
  chatMessages: {
    flex: 1,
    paddingHorizontal: s(12),
    paddingVertical: vs(16),
    gap: vs(14),
  },
  chatBubbleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: s(8),
  },
  chatBubbleRowLeft: {
    justifyContent: "flex-start",
  },
  chatBubbleRowRight: {
    justifyContent: "flex-end",
  },
  chatBubbleSkeleton: {
    maxWidth: "70%",
    paddingHorizontal: s(16),
    paddingVertical: vs(14),
    borderRadius: 20,
    backgroundColor: lightColors.bgHeavy,
  },
  chatBubbleLeft: {
    borderBottomStartRadius: 4,
  },
  chatBubbleRight: {
    borderBottomEndRadius: 4,
  },
  chatInputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: s(12),
    paddingVertical: vs(10),
    borderTopWidth: 1,
    borderTopColor: lightColors.separator,
    backgroundColor: lightColors.white,
  },
});
