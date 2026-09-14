import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RangePriceBar from '../../../../../Components/special/rangePriceBar';

interface PriceFilterProps {
    value: number[];
    setValue: (val: number[]) => void;
}

export default function PriceFilter({ value, setValue }: PriceFilterProps) {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <RangePriceBar
                    value={value}
                    onChange={setValue}
                    min={0}
                    max={2000}
                    step={10}
                    height={250}
                />
                <View style={styles.priceBoxes}>
                    <PriceBox label="Max Price" price={value[1]} />
                    <PriceBox label="Min Price" price={value[0]} />
                </View>
            </View>
        </View>
    );
}

function PriceBox({ label, price }: { label: string, price: number }) {
    return (
        <View style={styles.priceBoxContainer}>
            <View style={styles.labelContainer}>
                <Text style={styles.labelText}>{label}</Text>
            </View>
            <View style={styles.priceBox}>
                <Text style={styles.priceValue}>{price}</Text>
                <Text style={styles.currency}>EGP</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    priceBoxes: {
        justifyContent: 'center',
        height: 250,
        gap: 20,
        flex: 1,
    },
    priceBoxContainer: {
        position: 'relative',
        width: '100%',
    },
    labelContainer: {
        position: 'absolute',
        top: -10,
        left: 10,
        backgroundColor: '#F6F3EC',
        paddingHorizontal: 4,
        zIndex: 1,
    },
    labelText: {
        fontFamily: 'Inter-Regular',
        fontSize: 11,
        color: '#98A1B2',
    },
    priceBox: {
        borderWidth: 1,
        borderColor: '#D2D3D4',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    priceValue: {
        fontFamily: 'Inter-Bold',
        fontSize: 16,
        color: '#47C0D2',
    },
    currency: {
        fontFamily: 'Inter-Medium',
        fontSize: 13,
        color: '#000000',
    },
});
