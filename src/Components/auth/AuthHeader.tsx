import React from "react";
import { View, Text, StyleSheet, Pressable, StatusBar } from "react-native";
import { s, vs } from "react-native-size-matters";
import { LinearGradient } from "expo-linear-gradient";
import { SvgXml } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { headerWave, arrowSvg } from "../../assests/icons/AllIcon";

interface AuthHeaderProps {
  title: string;
  showBack?: boolean;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ title, showBack = true }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.headerWrapper}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={["#1B2351", "#47C0D2"]}
        style={[styles.headerGradient, { paddingTop: insets.top }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <SvgXml
          xml={headerWave}
          width="100%"
          height={vs(100)}
          style={styles.wave}
        />
        <View style={styles.headerContent}>
          {showBack && (
            <Pressable
              onPress={() => {
                if (navigation.canGoBack()) navigation.goBack();
              }}
              style={styles.backCircle}
            >
              <SvgXml xml={arrowSvg} width={s(8)} height={vs(14)} />
            </Pressable>
          )}
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

export default AuthHeader;

const styles = StyleSheet.create({
  headerWrapper: {
    width: "100%",
  },
  headerGradient: {
    height: vs(150),
    justifyContent: "flex-start",
    overflow: "hidden",
  },
  wave: {
    position: "absolute",
    bottom: 0,
    opacity: 0.2,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: s(20),
    marginTop: vs(20),
  },
  backCircle: {
    width: s(35),
    height: s(35),
    borderRadius: s(17.5),
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginEnd: s(15),
  },
  headerTitle: {
    fontSize: s(24),
    fontFamily: "Poppins-SemiBold",
    color: "#fff",
    fontWeight: "600",
  },
});
