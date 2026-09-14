import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import { SvgXml, SvgUri } from "react-native-svg";
import { s, vs, scale } from "react-native-size-matters";
import { lightColors } from "../../../../../theme";
import { useHomeCategories } from "../../hooks/Home/useHomeCategories";
import { useTranslation } from "react-i18next";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { UserStackParamList } from "../../../../Navigation/types";

const fallbackIcons: Record<string, string> = {
  FASHION: `<svg viewBox="0 0 24 24" fill="none" stroke="#1B2351" stroke-width="1.5"><path d="M12 4L4 8L12 12L20 8L12 4Z"/><path d="M4 12L12 16L20 12"/><path d="M4 16L12 20L20 16"/></svg>`,
  JEWELRY: `<svg viewBox="0 0 24 24" fill="none" stroke="#1B2351" stroke-width="1.5"><path d="M12 3L4 9L12 21L20 9L12 3Z"/><path d="M4 9H20"/></svg>`,
  SHOES: `<svg viewBox="0 0 24 24" fill="none" stroke="#1B2351" stroke-width="1.5"><path d="M4 16.5C4 16.5 6 14.5 10 14.5C14 14.5 20 17.5 20 17.5V19.5H4V16.5Z"/><path d="M4 16.5L8 4.5H11L14 14.5"/></svg>`,
  BEAUTY: `<svg viewBox="0 0 24 24" fill="none" stroke="#1B2351" stroke-width="1.5"><path d="M12 4L4 8L12 12L20 8L12 4Z"/><path d="M4 12L12 16L20 12"/><path d="M4 16L12 20L20 16"/></svg>`,
};

const DEFAULT_SVG = fallbackIcons.FASHION;

function getFallbackSvg(name: string): string {
  return fallbackIcons[name.toUpperCase()] || DEFAULT_SVG;
}

type IconType = "svgInline" | "svgUrl" | "imageUrl" | "fallbackSvg";

function getIconInfo(item: any): { type: IconType; value: string } {
  if (item.icon && typeof item.icon === "string" && item.icon.trim().toLowerCase().startsWith("<svg")) {
    return { type: "svgInline", value: item.icon };
  }

  const raw = item.iconUrl || item.imageUrl;
  if (raw && typeof raw === "string") {
    if (raw.trim().toLowerCase().endsWith(".svg")) {
      return { type: "svgUrl", value: raw };
    }
    return { type: "imageUrl", value: raw };
  }

  return { type: "fallbackSvg", value: getFallbackSvg(item.name) };
}

const CategoryItem = ({ item }: { item: any }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const { i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");
  const displayName = isArabic ? (item.arName || item.name) : item.name;
  const info = getIconInfo(item);

  const renderIcon = () => {
    if (info.type === "imageUrl" && !imgFailed) {
      return (
        <Image
          source={{ uri: info.value }}
          style={styles.catImage}
          resizeMode="cover"
          onError={() => setImgFailed(true)}
        />
      );
    }

    if (info.type === "svgUrl") {
      return <SvgUri uri={info.value} width={s(28)} height={s(28)} />;
    }

    if (info.type === "svgInline" || info.type === "fallbackSvg") {
      return <SvgXml xml={info.value} width={s(28)} height={s(28)} />;
    }

    return null;
  };

  const navigation = useNavigation<NavigationProp<UserStackParamList>>();

  const handlePress = () => {
    navigation.navigate("Shop", { category: item.name });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      style={styles.catItem}
    >
      <View style={[styles.whiteCircle, { backgroundColor: lightColors.white, shadowColor: lightColors.primary }]}>
        {imgFailed ? (
          <SvgXml xml={getFallbackSvg(item.name)} width={s(28)} height={s(28)} />
        ) : (
          renderIcon()
        )}
      </View>
      <Text style={[styles.catName, { color: lightColors.primary }]}>{displayName}</Text>
    </TouchableOpacity>
  );
};

const SkeletonCircle = () => (
  <View style={styles.catItem}>
    <View style={[styles.whiteCircle, styles.skeletonCircle]} />
    <View style={styles.skeletonLabel} />
  </View>
);

const Category = () => {
  const { data, isLoading, isError, refetch } = useHomeCategories();
  const { t } = useTranslation();

  const items: any[] = React.useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.data && Array.isArray(data.data)) return data.data;
    return [];
  }, [data]);

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: lightColors.bgMain }]}>
        <View style={styles.header}>
          <View style={styles.skeletonTitle} />
          <View style={[styles.skeletonLabel, { width: s(100), marginTop: vs(4) }]} />
        </View>
        <FlatList
          data={[1, 2, 3, 4]}
          renderItem={() => <SkeletonCircle />}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listPadding}
        />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.container, { backgroundColor: lightColors.bgMain }]}>
        <View style={styles.header}>
          <Text style={[styles.exploreText, { color: lightColors.primary }]}>{t("explore")}</Text>
          <Text style={styles.subTitle}>{t("shopByCategory")}</Text>
        </View>
        <View style={styles.errorRow}>
          <Text style={styles.errorText}>Failed to load categories.</Text>
          <TouchableOpacity onPress={() => refetch()}>
            <Text style={[styles.retryText, { color: lightColors.primary }]}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!items.length) return null;

  return (
    <View style={[styles.container, { backgroundColor: lightColors.bgMain }]}>
      <View style={styles.header}>
        <Text style={[styles.exploreText, { color: lightColors.primary }]}>{t("explore")}</Text>
        <Text style={styles.subTitle}>{t("shopByCategory")}</Text>
      </View>

      <FlatList
        data={items}
        renderItem={({ item }) => <CategoryItem item={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listPadding}
        keyExtractor={(item, index) =>
          item.id != null ? String(item.id) : String(index)
        }
      />
    </View>
  );
};

export default Category;

const styles = StyleSheet.create({
  container: {
    paddingTop: vs(1),
  },
  header: {
    paddingHorizontal: s(10),
    marginBottom: vs(20),
  },
  exploreText: {
    fontSize: scale(30),
    fontWeight: "400",
    fontFamily: "Inter",
  },
  subTitle: {
    fontSize: scale(10),
    color: "#555",
  },
  listPadding: {
    paddingHorizontal: s(1),
    paddingBottom: vs(10),
  },
  catItem: {
    alignItems: "center",
    marginHorizontal: s(10),
  },
  whiteCircle: {
    width: s(60),
    height: s(60),
    borderRadius: s(30),
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  catName: {
    marginTop: vs(10),
    fontSize: scale(12),
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  catImage: {
    width: "100%",
    height: "100%",
    borderRadius: s(30),
  },
  skeletonCircle: {
    backgroundColor: "#E0E0E0",
  },
  skeletonLabel: {
    marginTop: vs(10),
    width: s(50),
    height: s(12),
    backgroundColor: "#E0E0E0",
    borderRadius: s(4),
  },
  skeletonTitle: {
    width: s(120),
    height: s(30),
    backgroundColor: "#E0E0E0",
    borderRadius: s(4),
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: vs(20),
    gap: s(8),
  },
  errorText: {
    fontSize: scale(12),
    color: "#999",
  },
  retryText: {
    fontSize: scale(12),
    fontWeight: "600",
  },
});
