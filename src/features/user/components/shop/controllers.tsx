import React from 'react';
import { useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import ListIcon from '../../../../iconComponent/listIcon';
import GridIcon from '../../../../iconComponent/gridIcon';
import GradientButton from '../../../../Components/buttons/GradientButton';
import FilterIcon from '../../../../iconComponent/filterIcon';
import SortIcon from '../../../../iconComponent/sortIcon';
import BottomSheet from '../../../../Components/special/bottomSheet';
import FilterationComponent from './bottomSheets/filterationComponent';
import SortComponent from './bottomSheets/sortComponent';
import { useCart } from '../../hooks/useCart';
import { scale } from 'react-native-size-matters';
import { useAppDispatch, useAppSelector } from '../../../../Redux/store';
import {
  clearAllFilters,
  removeColor,
  setMainCategory,
  setPriceRange,
  setSizesSelected,
  setStockStatus,
  DEFAULT_PRICE_RANGE,
} from '../../../../Redux/slices/shopFiltersSlice';
import { colorType, mainCategoryType, sizeType } from '../../types/shop';

interface ControllersProps {
    viewMode: "list" | "grid";
    setViewMode: (viewMode: "list" | "grid") => void;
    totalRecords?: number;
    displayedCount: number;
}

export default function Controllers({
    viewMode,
    setViewMode,
    totalRecords,
    displayedCount,
}: ControllersProps) {
    const dispatch = useAppDispatch();
    const filters = useAppSelector((state) => state.shopFilters);

    const refRBSheetFilter = useRef<any>(null);
    const closeFilter = () => refRBSheetFilter.current.close();
    const openFilter = () => refRBSheetFilter.current.open();
    const refRBSheetSort = useRef<any>(null);
    const closeSort = () => refRBSheetSort.current.close();
    const openSort = () => refRBSheetSort.current.open();
    const { data: cartData } = useCart();
    const brands = cartData?.data?.brands ?? [];
    const cartCount = brands.length === 1 ? brands[0].items.length : 0;

    const activeFilterCount =
        filters.mainCategory.length +
        (filters.stockStatus ? 1 : 0) +
        filters.sizesSelected.length +
        filters.colors.length +
        (filters.priceRange[0] !== DEFAULT_PRICE_RANGE[0] || filters.priceRange[1] !== DEFAULT_PRICE_RANGE[1] ? 1 : 0);

    const hasActiveFilters = activeFilterCount > 0 || filters.Search.trim().length > 0;

    const handleRemoveCategory = (cat: mainCategoryType) => {
        const updated = filters.mainCategory.filter(c => c.id !== cat.id);
        dispatch(setMainCategory(updated));
    };

    const handleRemoveStock = () => {
        dispatch(setStockStatus(null));
    };

    const handleRemoveSize = (size: sizeType) => {
        const updated = filters.sizesSelected.filter(s => s.id !== size.id);
        dispatch(setSizesSelected(updated));
    };

    const handleRemoveColor = (color: colorType) => {
        dispatch(removeColor(color));
    };

    const handleRemovePrice = () => {
        dispatch(setPriceRange(DEFAULT_PRICE_RANGE));
    };

    return (
        <View style={styles.container}>
            <View style={styles.controllers}>
                <View style={styles.resultsRow}>
                    <Text style={styles.resultsText}>{displayedCount} Results</Text>
                    {cartCount > 0 && (
                        <TouchableOpacity style={styles.cartChip}>
                            <Text style={styles.cartChipText}>Cart: {cartCount} {cartCount === 1 ? 'item' : 'items'}</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.filterAndSort}>
                    <TouchableRipple onPress={openFilter} style={styles.filterSortButton}>
                        <View style={styles.filterSortInner}>
                            <FilterIcon width="14" height="14" fill={hasActiveFilters ? "#1B2351" : "#6B7280"} />
                            <Text style={[styles.filterSortLabel, hasActiveFilters && { color: "#1B2351", fontWeight: "700" }]}>
                                Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
                            </Text>
                        </View>
                    </TouchableRipple>
                    <View style={styles.divider} />
                    <TouchableRipple onPress={openSort} style={styles.filterSortButton}>
                        <View style={styles.filterSortInner}>
                            <SortIcon width="14" height="14" fill="#6B7280" />
                            <Text style={styles.filterSortLabel}>Sort</Text>
                        </View>
                    </TouchableRipple>
                </View>
            </View>

            {hasActiveFilters && (
                <View style={styles.appliedFilters}>
                    {filters.mainCategory.map(c => (
                        <TouchableOpacity key={`cat-${c.id}`} style={styles.activeChip} onPress={() => handleRemoveCategory(c)}>
                            <Text style={styles.activeChipText}>{c.name} ✕</Text>
                        </TouchableOpacity>
                    ))}
                    {filters.stockStatus && (
                        <TouchableOpacity style={styles.activeChip} onPress={handleRemoveStock}>
                            <Text style={styles.activeChipText}>{filters.stockStatus === "InStock" ? "In Stock" : filters.stockStatus === "OutOfStock" ? "Out of Stock" : filters.stockStatus} ✕</Text>
                        </TouchableOpacity>
                    )}
                    {filters.sizesSelected.map(s => (
                        <TouchableOpacity key={`size-${s.id}`} style={styles.activeChip} onPress={() => handleRemoveSize(s)}>
                            <Text style={styles.activeChipText}>{s.name} ✕</Text>
                        </TouchableOpacity>
                    ))}
                    {filters.colors.map(c => (
                        <TouchableOpacity key={`col-${c.id}`} style={styles.activeChip} onPress={() => handleRemoveColor(c)}>
                            <Text style={styles.activeChipText}>{c.name} ✕</Text>
                        </TouchableOpacity>
                    ))}
                    {(filters.priceRange[0] !== DEFAULT_PRICE_RANGE[0] || filters.priceRange[1] !== DEFAULT_PRICE_RANGE[1]) && (
                        <TouchableOpacity style={styles.activeChip} onPress={handleRemovePrice}>
                            <Text style={styles.activeChipText}>EGP {filters.priceRange[0]} - {filters.priceRange[1]} ✕</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => dispatch(clearAllFilters())} style={styles.clearChip}>
                        <Text style={styles.clearChipText}>Clear All</Text>
                    </TouchableOpacity>
                </View>
            )}

            <View style={styles.viewToggle}>
                <View style={styles.viewToggleInner}>
                    <GradientButton
                        onPress={() => setViewMode("grid")}
                        variant={viewMode === "grid" ? "default" : "regular"}
                        style={styles.viewButton}
                    >
                        <GridIcon
                            width="14"
                            height="14"
                            fill={viewMode === "grid" ? "white" : "#6B7280"}
                            style={{ marginHorizontal: 6, marginVertical: 6 }}
                        />
                    </GradientButton>
                    <GradientButton
                        onPress={() => setViewMode("list")}
                        variant={viewMode === "list" ? "default" : "regular"}
                        style={styles.viewButton}
                    >
                        <ListIcon
                            width="14"
                            height="14"
                            fill={viewMode === "list" ? "white" : "#6B7280"}
                            style={{ marginHorizontal: 6, marginVertical: 6 }}
                        />
                    </GradientButton>
                </View>
            </View>

            <BottomSheet refRBSheet={refRBSheetFilter}>
                <View style={{ height: "100%" }}>
                    <FilterationComponent close={closeFilter} />
                </View>
            </BottomSheet>

            <BottomSheet refRBSheet={refRBSheetSort}>
                <View style={{ height: "100%" }}>
                    <SortComponent close={closeSort} />
                </View>
            </BottomSheet>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 8,
        gap: 10,
    },
    controllers: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    resultsRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    resultsText: {
        fontFamily: "Inter-Medium",
        fontSize: 13,
        color: "#6B7280",
    },
    cartChip: {
        backgroundColor: "#F0FDF4",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
    },
    cartChipText: {
        fontSize: 11,
        color: "#16A34A",
        fontWeight: "600",
        fontFamily: "Inter-SemiBold",
    },
    filterAndSort: {
        flexDirection: "row",
        alignItems: "center",
        gap: 0,
    },
    filterSortButton: {
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    filterSortInner: {
        flexDirection: "row",
        gap: 4,
        alignItems: "center",
    },
    filterSortLabel: {
        fontFamily: "Inter-Medium",
        fontSize: 13,
        color: "#6B7280",
    },
    divider: {
        width: 1,
        height: 18,
        backgroundColor: "#E5E7EB",
    },
    appliedFilters: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        alignItems: "center",
    },
    activeChip: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 16,
        backgroundColor: "#1B2351",
    },
    activeChipText: {
        fontSize: 11,
        color: "#FFFFFF",
        fontFamily: "Inter-Medium",
    },
    clearChip: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 16,
        backgroundColor: "#FEE2E2",
        borderWidth: 1,
        borderColor: "#FECACA",
    },
    clearChipText: {
        fontSize: 11,
        color: "#DC2626",
        fontFamily: "Inter-Medium",
    },
    viewToggle: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    viewToggleInner: {
        flexDirection: "row",
        gap: 6,
    },
    viewButton: {
        width: 'auto',
        height: 'auto',
    },
});
