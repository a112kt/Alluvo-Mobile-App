import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { sizeType } from '../../../types/shop';

interface SizeFilterProps {
    sizeOptions: sizeType[];
    selectedSize: sizeType[];
    setSelectedSize: (sizes: sizeType[] | ((prev: sizeType[]) => sizeType[])) => void;
}

export default function SizeFilter({ sizeOptions, selectedSize = [], setSelectedSize }: SizeFilterProps) {
    const toggleSize = (option: sizeType) => {
        setSelectedSize((prev: sizeType[]) =>
            prev.some(item => item.id === option.id)
                ? prev.filter(item => item.id !== option.id)
                : [...prev, option]
        );
    };

    return (
        <View style={styles.container}>
            {sizeOptions.map((option, index) => {
                const isSelected = selectedSize.some(item => item.id === option.id);
                return (
                    <TouchableOpacity
                        key={option.id || index}
                        style={styles.optionContainer}
                        onPress={() => toggleSize(option)}
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
