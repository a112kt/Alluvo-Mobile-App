import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  ImageSourcePropType,
} from "react-native";
import { lightColors } from "../../theme";
import { Pressable } from "react-native";

type Props = {
  text: string;
  source: ImageSourcePropType;
  onPress?: () => void;
};

export default function Highlights({ text, source, onPress }: Props) {
  return (
    <View style={styles.container}>
      <Pressable onPress={onPress}>
        <Image source={source} style={styles.image} />
        <Text style={[styles.text, { color: lightColors.primary }]}>{text}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    marginHorizontal: 4,
    alignContent: "center",
    justifyContent: "center",
  },
  image: {
    width: 48,
    height: 48,
    marginBottom: 6,
    marginTop: 10,
  },
  text: {
    fontFamily: "Inter-Regular",
    fontWeight: "400",
    fontSize: 11,
    letterSpacing: 0,
    marginStart: 6,
  },
});
