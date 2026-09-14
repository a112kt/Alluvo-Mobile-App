import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SafeAreaWrapper = ({ children, style }: any) => {
  return (
    <SafeAreaView style={[styles.container, style]} edges={["top"]}>
      {children}
    </SafeAreaView>
  );
};

export default SafeAreaWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});