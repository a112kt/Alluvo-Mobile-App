import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../theme";

interface SalesChartProps {
  data: Array<{ label: string; value: number }>;
}

export default function SalesChart({ data }: SalesChartProps) {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const barMaxHeight = 140;

  return (
    <View style={styles.container}>
      <View style={styles.chartArea}>
        {data.map((point, index) => {
          const height = Math.max((point.value / maxValue) * barMaxHeight, 4);
          return (
            <View key={index} style={styles.barColumn}>
              <Text style={styles.barValue}>
                {point.value >= 1000
                  ? `${(point.value / 1000).toFixed(1)}k`
                  : point.value}
              </Text>
              <View
                style={[
                  styles.bar,
                  {
                    height,
                    backgroundColor:
                      index === data.length - 1
                        ? lightColors.secondary
                        : lightColors.primary,
                  },
                ]}
              />
              <Text style={styles.barLabel}>{point.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: vs(8),
  },
  chartArea: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 180,
    paddingTop: vs(20),
  },
  barColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    marginHorizontal: s(3),
  },
  bar: {
    width: "60%",
    borderRadius: s(6),
    minWidth: s(8),
    maxWidth: s(32),
  },
  barValue: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(10),
    color: lightColors.textSubtitle,
    marginBottom: vs(4),
  },
  barLabel: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(10),
    color: lightColors.textHint,
    marginTop: vs(6),
    textAlign: "center",
  },
});
