import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../../theme";
import { useGetBrandProducts } from "../../hooks/useReelManagement";

interface ProductSelectorProps {
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
}

export default function ProductSelector({ selectedIds, onSelectionChange }: ProductSelectorProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetBrandProducts({
    pageIndex: page,
    pageSize: 20,
    search: search || undefined,
  });

  const products = data?.data?.data ?? [];
  const totalPages = data?.data?.pagination?.totalPages ?? 1;

  const toggleProduct = useCallback(
    (rawId: number | string) => {
      const productId = Number(rawId);
      if (selectedIds.map(Number).includes(productId)) {
        onSelectionChange(selectedIds.filter((id) => Number(id) !== productId));
      } else {
        onSelectionChange([...selectedIds, productId]);
      }
    },
    [selectedIds, onSelectionChange]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Link Products</Text>
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={s(16)} color={lightColors.textHint} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor={lightColors.textHint}
          value={search}
          onChangeText={(text) => {
            setSearch(text);
            setPage(1);
          }}
        />
      </View>
      {selectedIds.length > 0 && (
        <Text style={styles.selectedCount}>
          {selectedIds.length} product{selectedIds.length !== 1 ? "s" : ""} selected
        </Text>
      )}
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={lightColors.secondary}
          style={{ marginTop: vs(20) }}
        />
      ) : (
        <ScrollView
          style={styles.list}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
        >
          {products.length === 0 ? (
            <Text style={styles.emptyText}>No products found</Text>
          ) : (
            products.map((item, index) => (
              <Pressable
                key={`product-${item.id}-${index}`}
                style={[styles.productRow, selectedIds.map(Number).includes(Number(item.id)) && styles.productRowSelected]}
                onPress={() => toggleProduct(item.id)}
              >
                <View style={styles.productImage}>
                  <Ionicons name="cube-outline" size={s(20)} color={lightColors.textInactive} />
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.productPrice}>EGP {item.price.toFixed(2)}</Text>
                </View>
                <View
                  style={[
                    styles.checkbox,
                    selectedIds.map(Number).includes(Number(item.id)) && styles.checkboxSelected,
                  ]}
                >
                  {selectedIds.map(Number).includes(Number(item.id)) && (
                    <Ionicons name="checkmark" size={s(16)} color="#fff" />
                  )}
                </View>
              </Pressable>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: vs(16),
  },
  sectionTitle: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(15),
    color: lightColors.textTitle,
    marginBottom: vs(8),
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: lightColors.bgLight,
    borderRadius: s(10),
    paddingHorizontal: s(10),
    height: vs(36),
    marginBottom: vs(8),
  },
  searchInput: {
    flex: 1,
    fontFamily: "Inter",
    fontSize: s(13),
    color: lightColors.textTitle,
    marginLeft: s(6),
  },
  selectedCount: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: s(12),
    color: lightColors.secondary,
    marginBottom: vs(6),
  },
  list: {
    maxHeight: vs(280),
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: vs(8),
    paddingHorizontal: s(8),
    borderRadius: s(10),
    marginBottom: vs(4),
  },
  productRowSelected: {
    backgroundColor: lightColors.bgLight,
  },
  productImage: {
    width: s(36),
    height: s(36),
    borderRadius: s(8),
    backgroundColor: lightColors.bgLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: s(10),
    overflow: "hidden",
  },
  productInfo: {
    flex: 1,
    marginRight: s(8),
  },
  productName: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: s(13),
    color: lightColors.textTitle,
  },
  productPrice: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(11),
    color: lightColors.textSubtitle,
    marginTop: vs(2),
  },
  checkbox: {
    width: s(22),
    height: s(22),
    borderRadius: s(11),
    borderWidth: 2,
    borderColor: lightColors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: lightColors.secondary,
    borderColor: lightColors.secondary,
  },
  emptyText: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(13),
    color: lightColors.textHint,
    textAlign: "center",
    marginTop: vs(16),
  },
});
