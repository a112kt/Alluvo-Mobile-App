import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { heartFilled } from "../assests/icons/AllIcon";

const HEART_SVG = heartFilled;

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

interface BurstHeart {
  angle: number;
  distance: number;
  size: number;
  driftX: number;
  driftY: number;
  delay: number;
}

function generateBurstHearts(count: number, seed: number): BurstHeart[] {
  const rng = seededRandom(seed);
  return Array.from({ length: count }, (_, i) => {
    const angle = 40 + rng() * 100;
    const distance = 70 + rng() * 90;
    return {
      angle,
      distance,
      size: 16 + rng() * 14,
      driftX: (rng() - 0.5) * 40,
      driftY: -(20 + rng() * 40),
      delay: i * 50,
    };
  });
}

interface DoubleTapHeartAnimationProps {
  visible: boolean;
  x: number;
  y: number;
  onAnimationEnd: () => void;
}

const BURST_COUNT = 7;
const LARGE_HEART_SIZE = 80;
const LARGE_DURATION = 900;
const SMALL_DURATION = 1000;

export default function DoubleTapHeartAnimation({
  visible,
  x,
  y,
  onAnimationEnd,
}: DoubleTapHeartAnimationProps) {
  const largeScale = useRef(new Animated.Value(0)).current;
  const largeOpacity = useRef(new Animated.Value(0)).current;
  const burstAnims = useRef(
    Array.from({ length: BURST_COUNT }, () => ({
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
      scale: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current;
  const heartsRef = useRef<BurstHeart[]>([]);
  const seedRef = useRef(0);

  useEffect(() => {
    if (!visible) return;

    seedRef.current = Date.now();
    heartsRef.current = generateBurstHearts(BURST_COUNT, seedRef.current);

    largeScale.setValue(0);
    largeOpacity.setValue(0);
    burstAnims.forEach((a) => {
      a.translateX.setValue(0);
      a.translateY.setValue(0);
      a.scale.setValue(0);
      a.opacity.setValue(0);
    });

    const largeHeart = Animated.sequence([
      Animated.parallel([
        Animated.spring(largeScale, {
          toValue: 1.4,
          useNativeDriver: true,
          friction: 4,
          tension: 120,
        }),
        Animated.timing(largeOpacity, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(largeScale, {
          toValue: 1.0,
          useNativeDriver: true,
          friction: 5,
          tension: 100,
        }),
        Animated.delay(200),
        Animated.timing(largeOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]);

    const burstHearts = heartsRef.current.map((h, i) => {
      const anim = burstAnims[i];
      const targetX = Math.cos((h.angle * Math.PI) / 180) * h.distance + h.driftX;
      const targetY = -Math.sin((h.angle * Math.PI) / 180) * h.distance + h.driftY;

      return Animated.sequence([
        Animated.delay(h.delay),
        Animated.parallel([
          Animated.timing(anim.translateX, {
            toValue: targetX,
            duration: SMALL_DURATION,
            useNativeDriver: true,
          }),
          Animated.timing(anim.translateY, {
            toValue: targetY,
            duration: SMALL_DURATION,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(anim.scale, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(anim.scale, {
              toValue: 0.5,
              duration: SMALL_DURATION - 200,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(anim.opacity, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.delay(SMALL_DURATION - 350),
            Animated.timing(anim.opacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]);
    });

    const animation = Animated.parallel([largeHeart, ...burstHearts]);
    animation.start(() => {
      onAnimationEnd();
    });

    return () => {
      animation.stop();
      largeScale.setValue(0);
      largeOpacity.setValue(0);
      burstAnims.forEach((a) => {
        a.translateX.setValue(0);
        a.translateY.setValue(0);
        a.scale.setValue(0);
        a.opacity.setValue(0);
      });
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View
        style={[
          styles.largeHeart,
          {
            left: x - LARGE_HEART_SIZE / 2,
            top: y - LARGE_HEART_SIZE / 2,
            opacity: largeOpacity,
            transform: [{ scale: largeScale }],
          },
        ]}
      >
        <SvgXml xml={HEART_SVG} width={LARGE_HEART_SIZE} height={LARGE_HEART_SIZE} />
      </Animated.View>

      {burstAnims.map((anim, i) => {
        const heart = heartsRef.current[i];
        if (!heart) return null;
        return (
          <Animated.View
            key={`burst-${i}`}
            style={[
              styles.burstHeart,
              {
                left: x - heart.size / 2,
                top: y - heart.size / 2,
                width: heart.size,
                height: heart.size,
                opacity: anim.opacity,
                transform: [
                  { translateX: anim.translateX },
                  { translateY: anim.translateY },
                  { scale: anim.scale },
                ],
              },
            ]}
          >
            <SvgXml xml={HEART_SVG} width={heart.size} height={heart.size} />
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    elevation: 999,
  },
  largeHeart: {
    position: "absolute",
    width: LARGE_HEART_SIZE,
    height: LARGE_HEART_SIZE,
  },
  burstHeart: {
    position: "absolute",
  },
});
