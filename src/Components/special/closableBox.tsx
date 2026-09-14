import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import CloseIcon from '../../iconComponent/closeIcon';

interface ClosableBoxProps {
    title: string;
    onClose?: () => void;
}

export default function ClosableBox({ title, onClose }: ClosableBoxProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
                <CloseIcon width="8" height="8" fill="white" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: "#3DA7B6",
        borderRadius: 2,
        paddingVertical: 4,
        paddingHorizontal: 8,
        gap: 8,
        alignItems: "center",
        alignSelf: 'flex-start', // Fit content
    },
    title: {
        fontFamily: "Inter",
        fontSize: 14,
        fontWeight: "400",
        color: "white",
    },
    closeButton: {
        padding: 2,
    },
});