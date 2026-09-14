import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppDispatch, useAppSelector } from '../../../../../Redux/store';
import { setSortItem } from '../../../../../Redux/slices/shopFiltersSlice';
import { sortOptionType } from '../../../types/shop';

interface SortComponentProps {
    close: () => void;
}

const sortOptions: sortOptionType[] = [
  { label: "Alphabetically, A to Z", SortBy: "name", SortOrder: "asc" },
  { label: "Alphabetically, Z to A", SortBy: "name", SortOrder: "desc" },
  { label: "Price, low to high", SortBy: "price", SortOrder: "asc" },
  { label: "Price, high to low", SortBy: "price", SortOrder: "desc" },
  { label: "Popularity", SortBy: "popularity", SortOrder: "desc" },
  { label: "Year - Newest to Oldest", SortBy: "createdAt", SortOrder: "desc" },
  { label: "Year - Oldest to Newest", SortBy: "createdAt", SortOrder: "asc" },
];

export default function SortComponent({ close }: SortComponentProps) {
  const dispatch = useAppDispatch();
  const selectedSort = useAppSelector((state) => state.shopFilters.SortItem);

  const handleSelect = (option: sortOptionType) => {
    dispatch(setSortItem(option));
    close();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sort By</Text>
      <View style={styles.optionsList}>
        {sortOptions.map((option, index) => {
          const isSelected = selectedSort?.SortBy === option.SortBy && selectedSort?.SortOrder === option.SortOrder;
          return (
            isSelected ? (
              <LinearGradient
                colors={['#1B2351', '#47C0D2']}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 0 }}
                style={styles.gradientBorder}
                key={index}
              >
                <View style={styles.selectedInner}>
                  <Text style={styles.selectedText}>{option.label}</Text>
                </View>
              </LinearGradient>
            ) : (
              <TouchableOpacity
                key={index}
                style={styles.unselectedButton}
                onPress={() => handleSelect(option)}
              >
                <Text style={styles.unselectedText}>{option.label}</Text>
              </TouchableOpacity>
            )
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F6F3EC',
        padding: 16,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        minHeight: 400,
    },
    title: {
        fontFamily: 'Inter-Bold',
        fontSize: 18,
        color: '#1B2351',
        marginBottom: 16,
    },
    optionsList: {
        gap: 10,
    },
    selectedInner: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
        justifyContent: 'center',
        backgroundColor: '#d8d8d8ff',
        paddingHorizontal: 16,
    },
    selectedText: {
        fontFamily: 'Inter-Medium',
        fontSize: 16,
    },
    unselectedButton: {
        width: '100%',
        height: 52,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D0D5DD',
        justifyContent: 'center',
        paddingHorizontal: 16,
        backgroundColor: 'transparent',
    },
    unselectedText: {
        color: '#30343C',
        fontFamily: 'Inter-Regular',
        fontSize: 16,
    },
    gradientBorder: {
        width: '100%',
        height: 52,
        borderRadius: 8,
        padding: 1,
        alignItems: 'center',
        backgroundColor: "#43475C1A"
    },
});
