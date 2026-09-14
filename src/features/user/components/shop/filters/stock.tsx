import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

interface StockFilterProps {
    selectedStock: string[];
    setSelectedStock: (stock: string[] | ((prev: string[]) => string[])) => void;
}

export default function StockFilter({ selectedStock = [], setSelectedStock }: StockFilterProps) {
    const stockOptions = ["In Stock", "Out of Stock"];

    const toggleStock = (option: string) => {
        setSelectedStock((prev: string[]) => 
            prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]
        );
    };

    return (
        <View style={styles.container}>
            {stockOptions.map((option, index) => (
                <TouchableOpacity 
                    key={index} 
                    style={styles.optionContainer} 
                    onPress={() => toggleStock(option)}
                >
                    <View style={[styles.checkbox, selectedStock.includes(option) && styles.checkboxSelected]}>
                        {selectedStock.includes(option) && <AntDesign name="check" size={12} color="white" />}
                    </View>
                    <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
            ))}
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
