import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BrandHeader from "../components/BrandHeader";
import BrandTabsBar from "../components/BrandTabsBar";
import BrandProfileSkeleton from "../components/BrandProfile/BrandProfileSkeleton";
import Reviews from "./Reviews";
import Policy from "../components/BrandProfile/Policy";
import Reels from "../components/BrandProfile/Reels";
import Shop from "../components/BrandProfile/Shop";
import { scale, vs } from "react-native-size-matters";
import BrandReelsScreen from "../screens/BrandReels";

type TabType = "reels" | "shop" | "offers" | "reviews" | "Policy";

import useBrandInfo from "../hooks/BrandProfile/useBrandInfo";

const NAVY = "#122550";

export default function BrandProfile({ route }: any) {
  const brandId = Number(route?.params?.brandId);
  const { response: brandData, loading, error } = useBrandInfo(brandId);
  const [activeTab, setActiveTab] = useState<TabType>(route?.params?.initialTab || "reels");
  const [isReelModalVisible, setIsReelModalVisible] = useState(false);
  const [selectedReelIndex, setSelectedReelIndex] = useState(0);
  const contentFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (route?.params?.initialTab) {
      setActiveTab(route.params.initialTab);
    }
  }, [route?.params?.initialTab]);

  useEffect(() => {
    if (!loading && brandData) {
      Animated.timing(contentFade, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [loading, brandData]);

  const openReelModal = (index: number) => {
    setSelectedReelIndex(index);
    setIsReelModalVisible(true);
  };

  if (!brandId) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Brand ID is required</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <BrandProfileSkeleton />
      </SafeAreaView>
    );
  }

  if (error || !brandData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorSubtitle}>We couldn't load this brand's profile.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const data = [{ id: "content" }];

  const renderContent = () => {
    switch (activeTab) {
      case "reels":
        return <Reels brandId={brandId} onReelPress={openReelModal} />;
      case "shop":
        return <Shop brandId={brandId} />;
      case "offers":
        return <Shop onlyOffers={true} brandId={brandId} />;
      case "reviews":
        return <Reviews brandId={brandId} />;
      case "Policy":
        return <Policy brandId={brandId} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Animated.View style={[styles.contentWrapper, { opacity: contentFade }]}>
        <FlatList
          data={data}
          keyExtractor={(i) => i.id}
          ListHeaderComponent={
            <>
              <BrandHeader brandData={brandData} brandId={brandId} />
              <BrandTabsBar activeTab={activeTab} onTabChange={setActiveTab} />
            </>
          }
          renderItem={() => (
            <View style={styles.tabContent}>{renderContent()}</View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </Animated.View>

      <Modal
        visible={isReelModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsReelModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <BrandReelsScreen
            onClose={() => setIsReelModalVisible(false)}
            brandId={brandId}
            initialIndex={selectedReelIndex}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  contentWrapper: {
    flex: 1,
  },
  tabContent: {
    paddingTop: 0,
  },
  listContent: {
    paddingBottom: vs(32),
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(40),
  },
  errorText: {
    fontSize: scale(16),
    color: "#64748B",
    fontFamily: "Inter",
    fontWeight: "500",
    textAlign: "center",
  },
  errorTitle: {
    fontSize: scale(20),
    fontWeight: "700",
    color: NAVY,
    fontFamily: "Inter",
    textAlign: "center",
    marginBottom: vs(8),
  },
  errorSubtitle: {
    fontSize: scale(14),
    color: "#94A3B8",
    fontFamily: "Inter",
    fontWeight: "500",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
});
