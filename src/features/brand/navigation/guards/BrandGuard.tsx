import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../Redux/store";
import { setBrandStatus, setBrandName, clearAuth } from "../../../../Redux/slices/authSlice";
import { getMyBrand } from "../../services/brandDashboard";

export default function BrandGuard({ children }: { children: React.ReactNode }) {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const { token, roles, brandStatus, isInUserMode } = useSelector((state: RootState) => state.auth);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!token) {
      navigation.reset({ index: 0, routes: [{ name: "Auth" }] });
      return;
    }

    if (roles && !roles.includes("Brand Owner")) {
      navigation.reset({ index: 0, routes: [{ name: "User" }] });
      return;
    }

    if (isInUserMode) {
      navigation.reset({ index: 0, routes: [{ name: "User" }] });
      return;
    }

    if (brandStatus === "BANNED") {
      dispatch(clearAuth());
      navigation.reset({ index: 0, routes: [{ name: "Auth" }] });
      return;
    }

    if (brandStatus) {
      setChecking(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const info = await getMyBrand();
        if (cancelled) return;
        if (info?.status) dispatch(setBrandStatus(info.status));
        if (info?.displayName) dispatch(setBrandName(info.displayName));

        if (info?.status === "BANNED") {
          dispatch(clearAuth());
          navigation.reset({ index: 0, routes: [{ name: "Auth" }] });
          return;
        }
      } catch {
        if (!cancelled) {
          dispatch(clearAuth());
          navigation.reset({ index: 0, routes: [{ name: "Auth" }] });
          return;
        }
      }
      if (!cancelled) setChecking(false);
    })();

    return () => { cancelled = true; };
  }, [token, roles, brandStatus, isInUserMode]);

  if (checking || !token) {
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
