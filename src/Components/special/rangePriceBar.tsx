import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet,
    Text,
    LayoutChangeEvent,
    Animated,
    PanResponder
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface RangePriceBarProps {
    value: number[];
    onChange: (newValue: number[]) => void;
    min?: number;
    max?: number;
    step?: number;
    height?: number;
}

const THUMB_SIZE = 30;
const TRACK_WIDTH = 6;

export default function RangePriceBar({
    value,
    onChange,
    min = 0,
    max = 2000,
    step = 10,
    height: containerHeight = 150
}: RangePriceBarProps) {
    // Mutable refs to track current locations accurately, avoiding stale closures
    const hRef = useRef(0);

    // Animated values for the two thumbs
    const pos1 = useRef(new Animated.Value(0)).current;
    const pos2 = useRef(new Animated.Value(0)).current;

    // Pixel locations
    const _pos1 = useRef(0);
    const _pos2 = useRef(0);

    // Refs for the track and labels to use setNativeProps
    const trackRef = useRef<View>(null);
    const label1Ref = useRef<View>(null);
    const label2Ref = useRef<View>(null);
    const labelText1Ref = useRef<Text>(null);
    const labelText2Ref = useRef<Text>(null);

    const [isDragging1, setIsDragging1] = useState(false);
    const [isDragging2, setIsDragging2] = useState(false);
    const draggingRef = useRef(false);

    // Re-render trigger only when height changes
    const [layoutHeight, setLayoutHeight] = useState(0);

    const valToPos = useCallback((v: number, railH: number) => {
        if (railH <= 0) return 0;
        const boundedV = Math.min(max, Math.max(min, v));
        return ((max - boundedV) / (max - min)) * railH;
    }, [max, min]);

    const posToVal = useCallback((p: number, railH: number) => {
        if (railH <= 0) return min;
        const val = max - (p / railH) * (max - min);
        return Math.min(max, Math.max(min, val));
    }, [max, min]);

    const updateUI = useCallback(() => {
        if (!trackRef.current || hRef.current <= 0) return;

        const top = Math.min(_pos1.current, _pos2.current) + THUMB_SIZE / 2;
        const height = Math.abs(_pos1.current - _pos2.current);

        trackRef.current.setNativeProps({
            style: { top, height }
        });

        const v1 = Math.round(posToVal(_pos1.current, hRef.current) / step) * step;
        const v2 = Math.round(posToVal(_pos2.current, hRef.current) / step) * step;

        if (labelText1Ref.current) labelText1Ref.current.setNativeProps({ text: `${v1}` });
        if (labelText2Ref.current) labelText2Ref.current.setNativeProps({ text: `${v2}` });
    }, [posToVal, step]);

    // Update both internal record and animated value, bypassing React renders
    const setInternalPos = useCallback((thumbId: 1 | 2, p: number) => {
        if (thumbId === 1) {
            _pos1.current = p;
            pos1.setValue(p);
        } else {
            _pos2.current = p;
            pos2.setValue(p);
        }
        updateUI();
    }, [pos1, pos2, updateUI]);

    useEffect(() => {
        const id1 = pos1.addListener(({ value }) => { _pos1.current = value; updateUI(); });
        const id2 = pos2.addListener(({ value }) => { _pos2.current = value; updateUI(); });
        return () => {
            pos1.removeListener(id1);
            pos2.removeListener(id2);
        };
    }, [updateUI]);

    // Handle prop value updates (only when not dragging)
    useEffect(() => {
        if (hRef.current > 0 && !draggingRef.current) {
            const p1 = valToPos(value[0], hRef.current);
            const p2 = valToPos(value[1], hRef.current);
            setInternalPos(1, p1);
            setInternalPos(2, p2);
        }
    }, [value, valToPos, setInternalPos, layoutHeight]);

    const onLayout = (event: LayoutChangeEvent) => {
        const h = event.nativeEvent.layout.height - THUMB_SIZE;
        if (h > 0 && h !== hRef.current) {
            hRef.current = h;
            setLayoutHeight(h);
            const p1 = valToPos(value[0], h);
            const p2 = valToPos(value[1], h);
            setInternalPos(1, p1);
            setInternalPos(2, p2);
        }
    };

    const commitChange = useCallback(() => {
        if (hRef.current <= 0) return;
        const v1 = Math.round(posToVal(_pos1.current, hRef.current) / step) * step;
        const v2 = Math.round(posToVal(_pos2.current, hRef.current) / step) * step;
        const sorted = [Math.min(v1, v2), Math.max(v1, v2)];
        onChange(sorted);
    }, [posToVal, step, onChange]);

    // Use PanResponder on the thumbs instead of the container container
    // And ALWAYS read from hRef.current to avoid stale closures
    const baseTouch1 = useRef(0);
    const pr1 = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                draggingRef.current = true;
                setIsDragging1(true);
                baseTouch1.current = _pos1.current;
                if (label1Ref.current) label1Ref.current.setNativeProps({ style: { opacity: 1 } });
            },
            onPanResponderMove: (e, gs) => {
                let next = baseTouch1.current + gs.dy;
                if (next < 0) next = 0;
                if (next > hRef.current) next = hRef.current;
                setInternalPos(1, next);
            },
            onPanResponderRelease: () => {
                draggingRef.current = false;
                setIsDragging1(false);
                commitChange();
                if (label1Ref.current) label1Ref.current.setNativeProps({ style: { opacity: 0 } });
            },
            onPanResponderTerminate: () => {
                draggingRef.current = false;
                setIsDragging1(false);
                if (label1Ref.current) label1Ref.current.setNativeProps({ style: { opacity: 0 } });
            }
        })
    ).current;

    const baseTouch2 = useRef(0);
    const pr2 = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                draggingRef.current = true;
                setIsDragging2(true);
                baseTouch2.current = _pos2.current;
                if (label2Ref.current) label2Ref.current.setNativeProps({ style: { opacity: 1 } });
            },
            onPanResponderMove: (e, gs) => {
                let next = baseTouch2.current + gs.dy;
                if (next < 0) next = 0;
                if (next > hRef.current) next = hRef.current;
                setInternalPos(2, next);
            },
            onPanResponderRelease: () => {
                draggingRef.current = false;
                setIsDragging2(false);
                commitChange();
                if (label2Ref.current) label2Ref.current.setNativeProps({ style: { opacity: 0 } });
            },
            onPanResponderTerminate: () => {
                draggingRef.current = false;
                setIsDragging2(false);
                if (label2Ref.current) label2Ref.current.setNativeProps({ style: { opacity: 0 } });
            }
        })
    ).current;

    return (
        <View style={[styles.container, { height: containerHeight }]} onLayout={onLayout}>
            {/* Visual Track Area */}
            <View style={styles.trackArea} pointerEvents="none">
                <View style={styles.rail} />
                <View
                    ref={trackRef}
                    style={styles.activeTrackContainer}
                >
                    <LinearGradient
                        colors={["#47C0D2", "#1B2351"]}
                        style={styles.gradientTrack}
                    />
                </View>
            </View>

            {/* Thumb 1 - Receives Touch Gestures */}
            <Animated.View
                style={[styles.thumbWrapper, { transform: [{ translateY: pos1 }], zIndex: isDragging1 ? 10 : 2 }]}
                {...pr1.panHandlers}
            >
                <View style={styles.hitTarget}>
                    <LinearGradient colors={["#1B2351", "#47C0D2"]} style={styles.thumbBorder}>
                        <View style={styles.thumbInner} />
                    </LinearGradient>
                </View>
                <View ref={label1Ref} style={[styles.label, { opacity: 0 }]}>
                    <Text ref={labelText1Ref} style={styles.labelText}>{value[0]}</Text>
                </View>
            </Animated.View>

            {/* Thumb 2 - Receives Touch Gestures */}
            <Animated.View
                style={[styles.thumbWrapper, { transform: [{ translateY: pos2 }], zIndex: isDragging2 ? 10 : 2 }]}
                {...pr2.panHandlers}
            >
                <View style={styles.hitTarget}>
                    <LinearGradient colors={["#1B2351", "#47C0D2"]} style={styles.thumbBorder}>
                        <View style={styles.thumbInner} />
                    </LinearGradient>
                </View>
                <View ref={label2Ref} style={[styles.label, { opacity: 0 }]}>
                    <Text ref={labelText2Ref} style={styles.labelText}>{value[1]}</Text>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 120, // Wider for labels on the right
        alignItems: 'center',
        paddingVertical: THUMB_SIZE / 2, // Space for the top and bottom visual ends
    },
    trackArea: {
        width: TRACK_WIDTH,
        height: '100%',
        alignItems: 'center',
    },
    rail: {
        width: TRACK_WIDTH,
        backgroundColor: '#EBEBEB',
        borderRadius: TRACK_WIDTH / 2,
        height: '100%',
    },
    activeTrackContainer: {
        position: 'absolute',
        width: TRACK_WIDTH,
        borderRadius: TRACK_WIDTH / 2,
        overflow: 'hidden',
    },
    gradientTrack: {
        flex: 1,
    },
    thumbWrapper: {
        position: 'absolute',
        width: THUMB_SIZE + 40, // Nice large hit area
        height: THUMB_SIZE + 40,
        top: -15, // Centers the 30px thumb directly over the edge if height starts from 0 padding
        alignItems: 'center',
        justifyContent: 'center',
    },
    hitTarget: {
        width: THUMB_SIZE + 40,
        height: THUMB_SIZE + 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    thumbBorder: {
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        borderRadius: THUMB_SIZE / 2,
        padding: 2,
        backgroundColor: 'white',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    thumbInner: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: THUMB_SIZE / 2,
    },
    label: {
        position: 'absolute',
        backgroundColor: '#1E2351',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        left: THUMB_SIZE + 20,
        minWidth: 50,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 4,
    },
    labelText: {
        color: 'white',
        fontSize: 13,
        fontFamily: 'Inter-Bold',
    },
});
