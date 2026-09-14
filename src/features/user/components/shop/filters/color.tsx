import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CheckIcon from '../../../../../iconComponent/checkIcon';
import { colorType } from '../../../types/shop';

interface ColorFilterProps {
    colorOptions: colorType[];
    selectedColor: colorType[];
    setSelectedColor: (colors: colorType[] | ((prev: colorType[]) => colorType[])) => void;
}

export default function ColorFilter({ colorOptions, selectedColor = [], setSelectedColor }: ColorFilterProps) {
    const toggleColor = (color: colorType) => {
        setSelectedColor((prev: colorType[]) =>
            prev.some(c => c.id === color.id)
                ? prev.filter(c => c.id !== color.id)
                : [...prev, color]
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            {colorOptions.map((color, index) => {
                const isSelected = selectedColor.some(c => c.id === color.id);
                const bgColor = color.hexCode || color.name.toLowerCase();
                return (
                    <TouchableOpacity
                        key={color.id || index}
                        style={styles.touchable}
                        onPress={() => toggleColor(color)}
                    >
                        <LinearGradient
                            colors={['#1B2351', '#47C0D2']}
                            style={styles.gradientBorder}
                        >
                            <View style={[
                                styles.colorCircle,
                                { backgroundColor: bgColor }
                            ]}>
                                {isSelected && (
                                    <CheckIcon
                                        width={14}
                                        height={14}
                                        fill={bgColor.toLowerCase() === '#ffffff' || bgColor === 'white' ? '#1B2351' : 'white'}
                                    />
                                )}
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        paddingVertical: 10,
    },
    touchable: {
        borderRadius: 18,
    },
    gradientBorder: {
        width: 36,
        height: 36,
        borderRadius: 18,
        padding: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    colorCircle: {
        width: '100%',
        height: '100%',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
