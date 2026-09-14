import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import GradientText from "../../../Components/GradientText";
import GradientButton from "../../../Components/buttons/GradientButton";
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from "react-native-svg";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../Navigation/AppNavigator";
import { useNavigation } from "@react-navigation/native";
import { lightColors } from "../../../../theme";

type RootNavigationType = NativeStackNavigationProp<RootStackParamList, "User">;

export default function Interests() {
  const [selected, setSelected] = useState<string[]>([]);
  const navigation = useNavigation<RootNavigationType>();

  const interestsList = [
    "Fashion",
    "Shoes",
    "Fashions",
    "Makeup",
    "Candles",
    "Perfumes",
    "Jewelry",
    "Accessories",
    "Bags",
    "Handmade Crafts",
  ];

  const toggleSelect = (item: string) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const chunkArray = (arr: string[], size: number) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  const rows = chunkArray(interestsList, 2);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ alignItems: "center", paddingBottom: 40 }}
    >
      {/* Logo */}
      <View style={styles.logoWrapper}>
        <GradientText text="Alluvo" textStyle={styles.logo} />
      </View>

      {/* Illustration */}
      <Image
        source={require("../../../assests/imgs/interests.png")}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Title */}
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>What’s your Interests?</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsWrapper}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((item, index) => {
              const isSelected = selected.includes(item);
              return (
                <TouchableOpacity
                  key={item + index}
                  onPress={() => toggleSelect(item)}
                  activeOpacity={0.8}
                  style={{ marginHorizontal: 4 }}
                >
                  {isSelected ? (
                    <LinearGradient
                      colors={["#47C0D2", "#1B2351"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.gradientBorder}
                    >
                      <View style={styles.innerButton}>
                        <Svg
                          width={15}
                          height={15}
                          viewBox="0 0 15 15"
                          fill="none"
                        >
                          <Path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1.875 3.4375L3.4375 1.875L7.5 5.9375L11.5625 1.875L13.125 3.4375L9.0625 7.5L13.125 11.5625L11.5625 13.125L7.5 9.0625L3.4375 13.125L1.875 11.5625L5.9375 7.5L1.875 3.4375Z"
                            fill="url(#gradFill)"
                            stroke="url(#gradStroke)"
                            strokeWidth={1.25}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <Defs>
                            <SvgLinearGradient
                              id="gradFill"
                              x1="1.875"
                              y1="7.5"
                              x2="13.125"
                              y2="7.5"
                              gradientUnits="userSpaceOnUse"
                            >
                              <Stop offset="0" stopColor="#1B2351" />
                              <Stop offset="1" stopColor="#47C0D2" />
                            </SvgLinearGradient>
                            <SvgLinearGradient
                              id="gradStroke"
                              x1="1.875"
                              y1="7.5"
                              x2="13.125"
                              y2="7.5"
                              gradientUnits="userSpaceOnUse"
                            >
                              <Stop offset="0" stopColor="#1B2351" />
                              <Stop offset="1" stopColor="#47C0D2" />
                            </SvgLinearGradient>
                          </Defs>
                        </Svg>

                        <Text style={styles.interestTextSelected}>{item}</Text>
                      </View>
                    </LinearGradient>
                  ) : (
                    <View style={styles.interestButton}>
                      <Text style={styles.interestText}>{item}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      {/* Continue Button */}
      <GradientButton
        onPress={() => {
          navigation.replace("User", { screen: "UserTabs" });
        }}
        text="Continue"
        style={styles.continueBtn}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.bgLight,
    paddingTop: 30,
  },
  logoWrapper: {
    width: "90%",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  logo: {
    fontFamily: "CinzelDecorative-Regular",
    fontWeight: "400",
    fontStyle: "normal",
    fontSize: 24,
    textAlign: "left",
    marginTop: 30,
  },
  image: {
    width: 157,
    height: 157,
    marginBottom: 20,
  },
  titleWrapper: {
    width: "90%",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 20,
    color: "#1B2351",
    fontWeight: "500",
    marginBottom: 20,
    textAlign: "left",
  },
  buttonsWrapper: {
    width: "90%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 18,
    gap: 8,
    flexWrap: "wrap",
  },
  gradientBorder: {
    borderRadius: 30,
    padding: 2,
  },
  innerButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  interestButton: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  interestText: {
    fontSize: 16,
    color: "#4A4A4A",
  },
  interestTextSelected: {
    fontSize: 16,
    color: "#1B2351",
    fontWeight: "600",
  },
  continueBtn: {
    marginTop: 30,
    width: "80%",
    margin: "auto",
  },
});
