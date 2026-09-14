import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { mainCategoryType } from '../../../types/shop';

interface CategoryFilterProps {
    CategoryOptions: mainCategoryType[];
    selectedCategory: mainCategoryType[];
    setSelectedCategory: (categories: mainCategoryType[] | ((prev: mainCategoryType[]) => mainCategoryType[])) => void;
}

export default function CategoryFilter({ CategoryOptions, selectedCategory = [], setSelectedCategory }: CategoryFilterProps) {
    const toggleCategory = (option: mainCategoryType) => {
        setSelectedCategory((prev: mainCategoryType[]) =>
            prev.some(item => item.id === option.id)
                ? prev.filter(item => item.id !== option.id)
                : [...prev, option]
        );
    };

    return (
        <View style={styles.container}>
            {CategoryOptions.map((option, index) => {
                const isSelected = selectedCategory.some(item => item.id === option.id);
                return (
                    <TouchableOpacity
                        key={option.id || index}
                        style={styles.optionContainer}
                        onPress={() => toggleCategory(option)}
                    >
                        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                            {isSelected && <AntDesign name="check" size={12} color="white" />}
                        </View>
                        <Text style={styles.optionText}>{option.name}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 12,
        paddingVertical: 10,
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#D0D5DD',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxSelected: {
        backgroundColor: '#1B2351',
        borderColor: '#1B2351',
    },
    optionText: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: '#30343C',
    },
});
