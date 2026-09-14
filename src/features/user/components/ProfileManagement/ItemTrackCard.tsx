import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { verticalScale, scale } from "react-native-size-matters";
import { lightColors } from "../../../../../theme";
import GradientText from "../../../../Components/GradientText";
import { OrderInfo as OrderInfoType } from "../../services/order";
import ProductImage from "../../../../Components/ProductImage";

interface ItemTrackCardProps {
  items?: OrderInfoType["items"];
  orderNumber?: string;
  status?: string;
}

const ItemTrackCard = ({
  items = [],
  orderNumber = "",
  status = "",
}: ItemTrackCardProps) => {
  const totalItems = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <View>
      <View style={styles.Trackcontainer}>
        <View style={styles.trackNumberContainer}>
          <Text style={[styles.trackTxt, { color: lightColors.subtitle }]}>Tracking number: </Text>
          <Text style={[styles.trcaknumber, { color: lightColors.primary }]}>{orderNumber || "N/A"}</Text>
        </View>
        {/* <Text style={styles.shippingTxt}>{status || "N/A"}</Text> */}
      </View>

      <Text style={[styles.item, { color: lightColors.primary }]}>{totalItems} items</Text>

      {items.map((item, idx) => (
        <View key={idx} style={[styles.card, { backgroundColor: lightColors.white }]}>
          <ProductImage item={item} style={styles.image} />

          <View style={styles.detailsContainer}>
            <View style={styles.titleColumn}>
              <Text style={[styles.productName, { color: lightColors.primary }]}>{item.productName || `Item ${idx + 1}`}</Text>
            </View>

            <View style={styles.attributesRow}>
              <View style={styles.attributeInline}>
                <GradientText text="Qty:" />
                <Text style={[styles.attributeValue, { color: lightColors.subtitle }]}>{item.quantity || 1}</Text>
              </View>
            </View>

            <View style={styles.quantityPriceRow}>
              <View style={styles.quantityInline}>
                <GradientText text="Price:" />
                <Text style={styles.quantityValue}>
                  {item.price ? `EGP ${item.price}` : "N/A"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default ItemTrackCard;

const styles = StyleSheet.create({
    item:{
        fontSize:scale(18),
        fontWeight:500,

    },
  card: {
    borderRadius: scale(16),
    padding: scale(12),
    flexDirection: "row",
    marginTop: verticalScale(15),
    alignItems: "center",
    shadowColor: "#0b2a4a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  
  },

  image: {
    width: scale(90),
    height: verticalScale(110),
    borderRadius: scale(10),
    marginEnd: scale(12),
    
  },

  detailsContainer: {
    flex: 1,
    justifyContent: "space-between",
  },

  titleColumn: {
    flexDirection: "column",
    marginBottom: verticalScale(4),
  },

  productName: {
    fontSize: scale(16),
    fontFamily: "Poppins-Bold",
    marginBottom: verticalScale(2),
  },

  brandText: {
    fontSize: scale(14),
  },

  attributesRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: verticalScale(6),
    gap: scale(16),
  },

  attributeInline: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
  },

  attributeValue: {
    fontSize: scale(12),
    fontFamily: "Poppins-Regular",
    marginStart: scale(1),
    marginTop: verticalScale(5),
  },

  quantityPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: verticalScale(8),
  },

  quantityInline: {
    flexDirection: "row",
    alignItems: "center",
  },

  quantityValue: {
    fontSize: scale(12),
    fontFamily: "Poppins-Regular",
    marginStart: scale(4),
    marginTop: verticalScale(5),
  },

  price: {
    fontSize: scale(18),
    fontFamily: "Poppins-Bold",
  },

  Trackcontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: verticalScale(20),
  },
  trackNumberContainer: {
    flexDirection: "row",
    marginBottom: verticalScale(10),
  },
  trackTxt: {
    fontSize: verticalScale(14),
    fontFamily: "Poppins-Regular",
  },
  trcaknumber: {
    fontSize: verticalScale(14),
    fontFamily: "Poppins-regular",
  },
  shippingTxt: {
    fontSize: verticalScale(16),
    fontFamily: "Poppins-Bold",
  },
});
