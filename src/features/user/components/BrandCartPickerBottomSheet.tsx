import React, { forwardRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import RBSheet from "react-native-raw-bottom-sheet";
import { CartBrandGroupRes } from "../services/cart";
import { absoluteUrl } from "../../../config/env";

const SCREEN_HEIGHT = Dimensions.get("window").height;

interface BrandCartPickerBottomSheetProps {
  brands: CartBrandGroupRes[];
  onSelectBrand: (brand: CartBrandGroupRes) => void;
}

const BrandCartPickerBottomSheet = forwardRef<
  any,
  BrandCartPickerBottomSheetProps
>(({ brands, onSelectBrand }, ref) => {
  const sheetRef = ref as React.MutableRefObject<any>;

  const getBrandLogoUri = (logoUrl?: string): string | null => {
    if (!logoUrl) return null;
    if (logoUrl.startsWith("http")) return logoUrl;
    return absoluteUrl(logoUrl);
  };

  const getBrandTotal = (brand: CartBrandGroupRes): number => {
    return brand.items.reduce(
      (sum, item) => sum + item.productPrice * item.quantity,
      0
    );
  };

  const getBrandItemCount = (brand: CartBrandGroupRes): number => {
    return brand.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <RBSheet
      ref={sheetRef}
      useNativeDriver={false}
      draggable
      height={SCREEN_HEIGHT * 0.6}
      customStyles={{
        wrapper: {
          backgroundColor: "rgba(0, 0, 0, 0.24)",
        },
        draggableIcon: {
          backgroundColor: "#CDCFD0",
          width: 40,
        },
        container: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: "white",
        },
      }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Select Brand</Text>
        <Text style={styles.subtitle}>
          Your cart has items from {brands.length} brands
        </Text>

        {brands.map((brand) => {
          const logoUri = getBrandLogoUri(brand.brandLogoUrl);
          const itemCount = getBrandItemCount(brand);
          const total = getBrandTotal(brand);

          return (
            <TouchableOpacity
              key={brand.brandId}
              style={styles.brandRow}
              activeOpacity={0.7}
              onPress={() => {
                sheetRef?.current?.close();
                onSelectBrand(brand);
              }}
            >
              <View style={styles.brandLeft}>
                {logoUri ? (
                  <Image source={{ uri: logoUri }} style={styles.brandLogo} />
                ) : (
                  <View style={[styles.brandLogo, styles.brandLogoPlaceholder]}>
                    <Text style={styles.brandInitial}>
                      {brand.brandName?.charAt(0)?.toUpperCase() ?? "?"}
                    </Text>
                  </View>
                )}
                <View style={styles.brandInfo}>
                  <Text style={styles.brandName} numberOfLines={1}>
                    {brand.brandName}
                  </Text>
                  <Text style={styles.brandItemCount}>
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </Text>
                </View>
              </View>
              <View style={styles.brandRight}>
                <Text style={styles.brandTotal}>
                  {total.toLocaleString("en")} EGP
                </Text>
                <Text style={styles.chevron}>›</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </RBSheet>
  );
});

export default BrandCartPickerBottomSheet;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(40),
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: scale(18),
    color: "#1B2351",
    textAlign: "center",
    marginBottom: verticalScale(4),
  },
  subtitle: {
    fontFamily: "Inter-Regular",
    fontSize: scale(13),
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: verticalScale(20),
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: verticalScale(10),
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  brandLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  brandLogo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F3F4F6",
  },
  brandLogoPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8EDFF",
  },
  brandInitial: {
    fontFamily: "Inter-Bold",
    fontSize: scale(16),
    color: "#1B2351",
  },
  brandInfo: {
    flex: 1,
  },
  brandName: {
    fontFamily: "Inter-SemiBold",
    fontSize: scale(14),
    color: "#1B2351",
    marginBottom: 2,
  },
  brandItemCount: {
    fontFamily: "Inter-Regular",
    fontSize: scale(12),
    color: "#9CA3AF",
  },
  brandRight: {
    alignItems: "flex-end",
    gap: 2,
  },
  brandTotal: {
    fontFamily: "Inter-SemiBold",
    fontSize: scale(13),
    color: "#47C0D2",
  },
  chevron: {
    fontFamily: "Inter-Bold",
    fontSize: scale(22),
    color: "#D1D5DB",
    marginTop: -4,
  },
});
