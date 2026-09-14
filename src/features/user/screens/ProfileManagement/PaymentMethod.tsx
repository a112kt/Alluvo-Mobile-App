import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BackBtn from "../../components/ProfileManagement/BackBtn";
import GradientText from "../../../../Components/GradientText";
import { lightColors } from "../../../../../theme";
import { scale, verticalScale } from "react-native-size-matters";
import BankCard from "../../components/ProfileManagement/BankCard";
import GradientButton from "../../../../Components/buttons/GradientButton";
import EditModal from "../../components/ProfileManagement/EditModal";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

const PaymentMethod = () => {
  let navigation = useNavigation();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalType, setModalType] = React.useState("");

  const openAdd = () => {
    setModalType("Add Card");
    setModalVisible(true);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackBtn />
        </TouchableOpacity>
        <GradientText text="Payment Methods" textStyle={styles.title} />
      </View>

      <ScrollView
        horizontal
        contentContainerStyle={styles.scrollContent}
        showsHorizontalScrollIndicator={false}
        style={styles.cardContainer}
      >
        <BankCard />
        <BankCard />
        <Pressable onPress={openAdd} style={styles.pressable}>
          <LinearGradient
            colors={["#47C0D2", "#1B2351"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            <Text style={styles.text}>+</Text>
          </LinearGradient>
        </Pressable>
      </ScrollView>

      {/* Modal */}
      <EditModal
        visible={modalVisible}
        title={modalType}
        onClose={() => setModalVisible(false)}
        onConfirm={() => {

          setModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
};

export default PaymentMethod;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.bgLight,
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(10),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: scale(26),
    fontWeight: "400",
    fontFamily: "Poppins-Regular",
  },
  cardContainer: {
    flexDirection: "row",
    marginTop: scale(10),
  },
  scrollContent: {
    gap: scale(10),
    paddingHorizontal: scale(5),
  },
  modalContainer: {
    height: "50%",
  },
  pressable: {
    borderRadius: 10,
    overflow: "hidden",
  },
  gradient: {
    width: scale(50),
    height: verticalScale(155),
    marginTop: scale(8),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: scale(10),
    marginHorizontal: scale(5),
  },
  text: {
    color: "#fff",
    fontWeight: "700",
    fontSize: scale(20),
  },
});
