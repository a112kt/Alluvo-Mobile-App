import React from "react";
import { Text, TextStyle, StyleSheet, StyleProp } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  text: string;
  textStyle?: StyleProp<TextStyle>;
  gradientColors?: readonly string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  numberOfLines?: number;
  ellipsizeMode?: "head" | "middle" | "tail" | "clip";
};

export default function GradientText({
  text,
  textStyle,
  gradientColors = ["#47C0D2", "#1B2351"],
  start = { x: 0, y: 0 },
  end = { x: 1, y: 0 },
  numberOfLines,
  ellipsizeMode,
}: Props) {

  const colorsTuple =
    gradientColors as readonly [string, string, ...string[]];

  return (
    <MaskedView
      maskElement={
        <Text
          style={textStyle}
          numberOfLines={numberOfLines}
          ellipsizeMode={ellipsizeMode}
        >
          {text}
        </Text>
      }
    >
      <LinearGradient
        colors={colorsTuple}
        start={start}
        end={end}
        style={styles.gradient}
      >
        <Text
          style={[textStyle, { opacity: 0 }]}
          numberOfLines={numberOfLines}
          ellipsizeMode={ellipsizeMode}
        >
          {text}
        </Text>
      </LinearGradient>
    </MaskedView>
  );

}

const styles = StyleSheet.create({
  gradient: {
    alignSelf: "flex-start",
  },
});