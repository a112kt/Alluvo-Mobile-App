import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";
import { lightColors } from "../../../../theme";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { UserStackParamList } from "../../../Navigation/types";
import { Address } from "../types";
import { getAddresses, deleteAddress } from "../api";
import AddressCard from "../components/AddressCard";
import EmptyState from "../components/EmptyState";
import SkeletonLoader from "../components/SkeletonLoader";
import BackBtn from "../../user/components/ProfileManagement/BackBtn";
import { showToast } from "../../../services/toastService";
import { useTranslation } from "react-i18next";
import { SvgXml } from "react-native-svg";

const AddressListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<UserStackParamList>>();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchAddresses = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      }
      const response = await getAddresses();
      if (response.success) {
        setAddresses(response.data || []);
      }
    } catch (error: any) {
      const msg = error?.friendlyMessage || error?.message || "Failed to load addresses";
      showToast(
        isArabic ? "خطأ" : "Error",
        typeof msg === "string" ? msg : "Failed to load addresses",
        undefined,
        "error"
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [isArabic]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchAddresses();
    });
    return unsubscribe;
  }, [navigation, fetchAddresses]);

  const handleDelete = (address: Address) => {
    if (!address.id) return;
    Alert.alert(
      isArabic ? "حذف العنوان" : "Delete Address",
      isArabic ? "هل أنت متأكد من حذف هذا العنوان؟" : "Are you sure you want to delete this address?",
      [
        { text: isArabic ? "إلغاء" : "Cancel", style: "cancel" },
        {
          text: isArabic ? "حذف" : "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setDeletingId(address.id!);
              const response = await deleteAddress(address.id!);
              if (response.success) {
                showToast(
                  isArabic ? "تم الحذف" : "Deleted",
                  response.message?.[isArabic ? "ar" : "en"] || (isArabic ? "تم حذف العنوان بنجاح" : "Address deleted successfully"),
                  undefined,
                  "success"
                );
                fetchAddresses();
              }
            } catch (error: any) {
              const msg = error?.friendlyMessage || error?.message || "Failed to delete address";
              showToast(
                isArabic ? "خطأ" : "Error",
                typeof msg === "string" ? msg : "Failed to delete address",
                undefined,
                "error"
              );
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  const handleEdit = (address: Address) => {
    navigation.navigate("AddAddress", { address });
  };

  const handleAdd = () => {
    navigation.navigate("AddAddress");
  };

  const plusSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4V20M4 12H20" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`;

  const renderItem = ({ item }: { item: Address }) => (
    <View>
      {deletingId === item.id && (
        <View style={styles.deletingOverlay}>
          <ActivityIndicator size="small" color={lightColors.textDanger} />
        </View>
      )}
      <AddressCard
        address={item}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </View>
  );

  const renderContent = () => {
    if (isLoading) {
      return <SkeletonLoader />;
    }

    if (!addresses.length) {
      return <EmptyState onAddPress={handleAdd} />;
    }

    return (
      <FlatList
        data={addresses}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id || Math.random())}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => fetchAddresses(true)}
            colors={[lightColors.secondary]}
            tintColor={lightColors.secondary}
          />
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <BackBtn />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isArabic ? "عناوين الشحن" : "Shipping Address"}
        </Text>
        <View style={styles.headerRight} />
      </View>

      {renderContent()}

      {addresses.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={handleAdd}
          activeOpacity={0.85}
        >
          <SvgXml xml={plusSvg} width={24} height={24} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default AddressListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.bgLight,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(10),
  },
  backBtn: {
    padding: scale(4),
  },
  headerTitle: {
    fontSize: scale(20),
    fontWeight: "600",
    color: lightColors.primary,
    fontFamily: "Inter-SemiBold",
  },
  headerRight: {
    width: scale(44),
  },
  listContent: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(4),
    paddingBottom: verticalScale(100),
  },
  fab: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? verticalScale(30) : verticalScale(20),
    right: scale(20),
    width: scale(56),
    height: scale(56),
    borderRadius: scale(28),
    backgroundColor: lightColors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: lightColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  deletingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});
