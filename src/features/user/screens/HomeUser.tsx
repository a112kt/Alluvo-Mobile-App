import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFloatingTabBarPadding } from "../../../hooks/useFloatingTabBarPadding";
import { lightColors } from "../../../../theme";
import { useQueryClient } from "@tanstack/react-query";
import { HOME_CATEGORIES_QUERY_KEY } from "../hooks/Home/useHomeCategories";
import { HOME_PRODUCTS_QUERY_KEY } from "../hooks/Home/useHomeProducts";
import { HOME_REELS_QUERY_KEY } from "../hooks/Home/useHomeReels";
import { TODAY_OFFERS_QUERY_KEY } from "../hooks/Home/useTodayOffers";
import { TOP_BRANDS_QUERY_KEY } from "../hooks/Home/useTopBrands";
import { WISHLIST_QUERY_KEY } from "../hooks/useWishlist";
import OfferCompoent from "../components/Home/OfferCompoent";

import { StatusBar } from "expo-status-bar";
import Header from "../components/Home/Header";
import Category from "../components/Home/Category";
import TopBrand from "../components/Home/TopBrand";
import FavProduct from "../components/Home/FavProduct";
import Explore from "../components/Home/Explore";

export let homeTabPressHandler: (() => void) | null = null;

export default function HomeScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const queryClient = useQueryClient();
  const tabBarPadding = useFloatingTabBarPadding();

  useEffect(() => {
    homeTabPressHandler = () => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      queryClient.invalidateQueries({ queryKey: HOME_CATEGORIES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: HOME_PRODUCTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: HOME_REELS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: TODAY_OFFERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: TOP_BRANDS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
    };
    return () => {
      homeTabPressHandler = null;
    };
  }, [queryClient]);

  return (
    <View style={{ flex: 1, backgroundColor: lightColors.bgLight }}>
      <StatusBar style="dark" backgroundColor={lightColors.bgLight} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ paddingBottom: tabBarPadding }}
          style={{ backgroundColor: lightColors.bgLight }}
          showsVerticalScrollIndicator={false}
        >
          <Header />
          <OfferCompoent />
          <Category />
          <TopBrand />
          <FavProduct />
          <Explore />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: lightColors.bgLight,
  },
});