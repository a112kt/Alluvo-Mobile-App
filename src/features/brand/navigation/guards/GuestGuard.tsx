import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../../../../Redux/store";

export default function GuestGuard({ children }: { children: React.ReactNode }) {
  const navigation = useNavigation<any>();
  const { token, roles, isInUserMode } = useSelector((state: RootState) => state.auth);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (token && roles?.includes("Brand Owner") && !isInUserMode) {
      navigation.reset({ index: 0, routes: [{ name: "Brand" }] });
      return;
    }
    setChecking(false);
  }, [token, roles, isInUserMode]);

  if (checking) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1B2351" />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FBFBFF",
  },
});
