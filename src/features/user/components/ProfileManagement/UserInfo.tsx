import { Modal, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { Image } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { lightColors } from "../../../../../theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MenuBtn from "./MenuBtn";
import ModalCard from "./ModalCard";
import { useTranslation } from "react-i18next";

interface UserInfoProps {
  profileData?: {
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
    numberOfFollowing: number;
    numberOfOrders: number;
  };
  isLoading: boolean;
  onFollowingPress?: () => void;
}

const UserInfo = ({ profileData, isLoading, onFollowingPress }: UserInfoProps) => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const actionBtn = ["Following", "Orders"];
  const dataCount = [
    profileData?.numberOfFollowing ?? 0,
    profileData?.numberOfOrders ?? 0,
  ];
  const disableBtn = lightColors.subtitle;
  const enableBtn = lightColors.primary;
  const [activeBtn, setactiveBtn] = useState("Following"); // Match case with items

  const [showModal, setShowModal] = useState(false);

  return (
    <View style={[styles.container, { paddingTop: insets.top + verticalScale(10) }]}>
      <View style={[styles.menuWrapper, { top: insets.top + verticalScale(0) }]}>
        <TouchableOpacity onPress={() => setShowModal(true)}>
          <MenuBtn />
        </TouchableOpacity>

        <Modal
          visible={showModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowModal(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowModal(false)}
          >
            <View
              style={[
                styles.meunCard,
                { top: insets.top + verticalScale(14), right: scale(31) },
              ]}
            >
              <TouchableOpacity activeOpacity={1}>
                <ModalCard />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={lightColors.primary} />
        </View>
      ) : (
        <>
          <Image
            style={styles.profileImg}
            source={
              profileData?.profileImageUrl
                ? { uri: profileData.profileImageUrl }
                : require("../../../../assests/imgs/ProfileImg.png")
            }
          />

          <Text style={[styles.userName, { color: lightColors.primary }]}>
            {profileData ? `${profileData.firstName} ${profileData.lastName}` : ""}
          </Text>

          <View style={styles.actionContainer}>
            {actionBtn.map((item, index) => (
              <TouchableOpacity
                key={item}
                onPress={() => {
                  setactiveBtn(item);
                  if (item === "Following") onFollowingPress?.();
                }}
                style={styles.column}
              >
                <Text
                  style={[
                    styles.actionText,
                    { color: activeBtn === item ? enableBtn : disableBtn },
                  ]}
                >
                  {item === "Following" ? t("following") : item === "Orders" ? t("orders") : item}
                </Text>

                <Text style={[styles.num, { color: lightColors.primary }]}>{dataCount[index]}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

export default UserInfo;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: verticalScale(20),
  },
  profileImg: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
  },
  userName: {
    fontWeight: 700,
    fontSize: scale(22),
    textAlign: "left",
    marginTop: verticalScale(7),
    marginStart: scale(3),
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: verticalScale(7),
    width: scale(140),
  },
  actionText: {
    fontSize: scale(14),
    fontWeight: 400,
    fontFamily: "Poppins-Regular",
  },
  num: {
    fontSize: scale(14),
    fontWeight: 600,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
  },
  column: {
    alignItems: "center",
  },

  menuWrapper: {
    position: "absolute",
    top: verticalScale(30),
    right: scale(31),
    zIndex: 10,
    elevation: 10,
    alignItems: "flex-end",
  },
  meunCard: {
    position: "absolute",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  loadingContainer: {
    height: verticalScale(140),
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});
