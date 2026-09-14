import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../../../Redux/store';
import {
  setMainCategory, setPriceRange, setStockStatus,
  setColors, setSizesSelected, setSearch,
  DEFAULT_PRICE_RANGE,
} from '../../../../../Redux/slices/shopFiltersSlice';
import { useCategories } from '../../../hooks/useLookups';
import { useColors, useSizes } from '../../../hooks/useLookups';
import { mainCategoryType, colorType, sizeType } from '../../../types/shop';
import CategoryFilter from '../filters/category';
import StockFilter from '../filters/stock';
import ColorFilter from '../filters/color';
import PriceFilter from '../filters/price';
import SizeFilter from '../filters/size';
import GradientButton from '../../../../../Components/buttons/GradientButton';

interface FilterationComponentProps {
    close: () => void;
}

const FILTER_TABS = ["Category", "Stock Status", "Size", "Color", "Price"];

export default function FilterationComponent({ close }: FilterationComponentProps) {
  const dispatch = useAppDispatch();
  const reduxFilters = useAppSelector((state) => state.shopFilters);

  const { data: categoriesData } = useCategories();
  const { data: colorsData } = useColors();
  const { data: sizesData } = useSizes();

  const categories: mainCategoryType[] = categoriesData?.data ?? [];
  const colors: colorType[] = colorsData?.data ?? [];
  const sizes: sizeType[] = sizesData?.data ?? [];

  const [activeFilter, setActiveFilter] = useState("Category");
  const [localMainCategory, setLocalMainCategory] = useState<mainCategoryType[]>([...reduxFilters.mainCategory]);
  const [localStock, setLocalStock] = useState<string[]>([...(reduxFilters.stockStatus ? [reduxFilters.stockStatus] : [])]);
  const [localSizes, setLocalSizes] = useState<sizeType[]>([...reduxFilters.sizesSelected]);
  const [localColors, setLocalColors] = useState<colorType[]>([...reduxFilters.colors]);
  const [localPriceRange, setLocalPriceRange] = useState<number[]>([...reduxFilters.priceRange]);

  const handleStockChange = (val: string[] | ((prev: string[]) => string[])) => {
    setLocalStock(typeof val === 'function' ? val(localStock) : val);
  };

  const handlePriceChange = (val: number[]) => {
    setLocalPriceRange(val);
  };

  const resetAll = () => {
    setLocalMainCategory([]);
    setLocalStock([]);
    setLocalSizes([]);
    setLocalColors([]);
    setLocalPriceRange([...DEFAULT_PRICE_RANGE]);
  };

  const mapStockToApi = (label: string): string => {
    if (label === "In Stock") return "InStock";
    if (label === "Out of Stock") return "OutOfStock";
    return label;
  };

  const handleSearch = () => {
    dispatch(setMainCategory(localMainCategory));
    dispatch(setStockStatus(localStock.length > 0 ? mapStockToApi(localStock[0]) : null));
    dispatch(setSizesSelected(localSizes));
    dispatch(setColors(localColors));
    dispatch(setPriceRange(localPriceRange));
    dispatch(setSearch(""));
    close();
  };

  const activeFilterCount =
    localMainCategory.length +
    localStock.length +
    localSizes.length +
    localColors.length +
    (localPriceRange[0] !== DEFAULT_PRICE_RANGE[0] || localPriceRange[1] !== DEFAULT_PRICE_RANGE[1] ? 1 : 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Filter Results</Text>
        <TouchableOpacity onPress={resetAll}>
          <Text style={styles.resetText}>Reset Filters</Text>
        </TouchableOpacity>
      </View>

      {activeFilterCount > 0 && (
        <View style={styles.appliedPreview}>
          {localMainCategory.map(c => (
            <View key={`cat-${c.id}`} style={styles.previewChip}>
              <Text style={styles.previewChipText}>{c.name}</Text>
            </View>
          ))}
          {localStock.map(s => (
            <View key={`stock-${s}`} style={styles.previewChip}>
              <Text style={styles.previewChipText}>{s === "InStock" ? "In Stock" : s}</Text>
            </View>
          ))}
          {localSizes.map(s => (
            <View key={`size-${s.id}`} style={styles.previewChip}>
              <Text style={styles.previewChipText}>{s.name}</Text>
            </View>
          ))}
          {localColors.map(c => (
            <View key={`col-${c.id}`} style={styles.previewChip}>
              <Text style={styles.previewChipText}>{c.name}</Text>
            </View>
          ))}
          {(localPriceRange[0] !== DEFAULT_PRICE_RANGE[0] || localPriceRange[1] !== DEFAULT_PRICE_RANGE[1]) && (
            <View style={styles.previewChip}>
              <Text style={styles.previewChipText}>EGP {localPriceRange[0]} - {localPriceRange[1]}</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.contentRow}>
        <View style={styles.sidebar}>
          {FILTER_TABS.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.sidebarItem,
                activeFilter === filter && styles.sidebarItemActive
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[
                styles.sidebarText,
                activeFilter === filter && styles.sidebarTextActive
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.mainContent}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.filterContent}>
              {activeFilter === "Category" && (
                <CategoryFilter
                  CategoryOptions={categories}
                  selectedCategory={localMainCategory}
                  setSelectedCategory={setLocalMainCategory}
                />
              )}
              {activeFilter === "Stock Status" && (
                <StockFilter
                  selectedStock={localStock}
                  setSelectedStock={handleStockChange}
                />
              )}
              {activeFilter === "Size" && (
                <SizeFilter
                  sizeOptions={sizes}
                  selectedSize={localSizes}
                  setSelectedSize={setLocalSizes}
                />
              )}
              {activeFilter === "Color" && (
                <ColorFilter
                  colorOptions={colors}
                  selectedColor={localColors}
                  setSelectedColor={setLocalColors}
                />
              )}
              {activeFilter === "Price" && (
                <PriceFilter
                  value={localPriceRange}
                  setValue={handlePriceChange}
                />
              )}
            </View>
          </ScrollView>
        </View>
      </View>
      <View style={styles.bottomButton}>
        <GradientButton onPress={handleSearch} variant="default" style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </GradientButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F6F3EC',
        flex: 1,
        borderRadius: 20,
        overflow: 'hidden',
        height: "100%"
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontFamily: 'Inter-Bold',
        fontSize: 18,
        color: '#1B2351',
    },
    resetText: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: '#EF4444',
    },
    appliedPreview: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    previewChip: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: '#1B2351',
    },
    previewChipText: {
        fontSize: 10,
        color: '#FFFFFF',
        fontFamily: 'Inter-Medium',
    },
    contentRow: {
        flexDirection: 'row',
        flex: 1,
    },
    sidebar: {
        width: '30%',
    },
    sidebarItem: {
        paddingVertical: 15,
        paddingHorizontal: 12,
        borderLeftWidth: 3,
        borderLeftColor: 'transparent',
    },
    sidebarItemActive: {
        backgroundColor: '#43475C1A',
        borderLeftColor: '#1B2351',
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
    },
    sidebarText: {
        fontFamily: 'Inter-Regular',
        fontSize: 13,
        color: '#30343C',
    },
    sidebarTextActive: {
        fontFamily: 'Inter-Medium',
        color: '#1B2351',
    },
    mainContent: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 15,
        justifyContent: 'space-between',
    },
    filterContent: {
        flex: 1,
        marginBottom: 20,
    },
    searchButton: {
        width: '80%',
        height: 52,
        marginTop: 'auto',
        alignSelf: "center",
        borderRadius: 8,
    },
    searchButtonText: {
        color: '#FFFFFF',
        fontFamily: 'Inter-Medium',
        fontSize: 16,
    },
    bottomButton: {
        paddingVertical: 16,
        paddingHorizontal: 10,
        borderTopWidth: 1,
        borderTopColor: '#D2D3D4',
    }
});
