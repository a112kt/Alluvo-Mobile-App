import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { scale, verticalScale } from "react-native-size-matters";
import { lightColors } from "../../../../../theme";
import GradientButton from "../../../../Components/buttons/GradientButton";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { UserStackParamList } from "../../../../Navigation/types";

interface OrderCardProps {
  orderId?: string;
  itemCount?: number;
  deliveryType?: string;
  status?: string;
  onTrack?: () => void;
  images?: any[];
}

const OrderCard: React.FC<OrderCardProps> = ({
  orderId = "Order #744535424",
  itemCount = 3,
  deliveryType = "Standard Delivery",
  status = "Packed",
  onTrack,
  images = [
    require("../../../../assests/imgs/Women.png"),
    require("../../../../assests/imgs/Women.png"),
  ],
}) => {
    const navigation = useNavigation<NavigationProp<UserStackParamList>>();
  return (
    <View style={styles.container}>
      {/* Images Section */}
      <View style={styles.imgContainer}>
        <View style={styles.firstRow}>
          {images.slice(0, 2).map((img, idx) => (
            <Image
              key={idx}
              source={img}
              style={styles.itemImg}
              resizeMode="cover"
            />
          ))}
        </View>
        {/* <Image
          source={require("../../../../assests/imgs/Shipping.png")}
          style={styles.shippingImg}
          resizeMode="cover"
        /> */}
      </View>

      {/* Order Details Section */}
      <View style={styles.detailsSection}>
        <Text style={styles.orderId}>{orderId}</Text>
        <Text style={styles.deliveryType}>{deliveryType}</Text>
        <Text style={styles.statusText}>{status}</Text>
      </View>

      {/* Action Section */}
      <View style={styles.actionSection}>
        <Text style={styles.itemCount}>{itemCount} Items</Text>
        <TouchableOpacity 
          onPress={() => onTrack ? onTrack() : navigation.navigate('OrderDetails')} 
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["rgba(71, 192, 210, 0.8)","rgba(27, 35, 81, 0.8)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBtn}
          >
            <Text style={styles.btnText}>Track</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(1),
    marginBottom: verticalScale(12),
    backgroundColor: lightColors.bgMain,
  },
  imgContainer: {
    justifyContent: "center",
    gap: verticalScale(4),
    paddingVertical:verticalScale(8),
    paddingHorizontal:scale(4),
    borderRadius:10,
    backgroundColor:lightColors.white,
  },
  firstRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: scale(6),
  },
  itemImg: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(6),
    backgroundColor: lightColors.bgMain,
  },
  shippingImg: {
    width: "100%",
    height: verticalScale(30),
    borderRadius: scale(6),
  },
  detailsSection: {
    flex: 1,
    marginHorizontal: scale(8),
    justifyContent: "center",
  },
  orderId: {
    fontSize: scale(13),
    fontFamily: "Poppins-Bold",
    fontWeight: "600" as any,
    color: lightColors.primary,
    marginBottom: verticalScale(2),
  },
  deliveryType: {
    fontSize: scale(10),
    fontFamily: "Poppins-Regular",
    color: lightColors.subtitle,
    marginBottom: verticalScale(3),
  },
  statusText: {
    fontSize: scale(15),
    fontFamily: "Poppins-Bold",
    fontWeight: "600" as any,
    color: lightColors.primary,
    marginTop: verticalScale(8),
  },
  actionSection: {
    alignItems: "center",
    justifyContent: "center",
    gap: verticalScale(4),
    minWidth: scale(60),
  },
  itemCount: {
    fontSize: scale(11),
    fontFamily: "Poppins-Regular",
    color: lightColors.primary,
    fontWeight: "500" as any,
    backgroundColor: lightColors.white,
    paddingHorizontal: scale(6),
    borderRadius: scale(4),
  },
  gradientBtn: {
    paddingVertical: verticalScale(4),
    paddingHorizontal: scale(14),
    borderRadius: scale(6),
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(18),
  },
  btnText: {
    fontSize: scale(11),
    fontFamily: "Poppins-Regular",
    fontWeight: "500" as any,
    color: "#fff",
    textAlign: "left",
  },
});
