import { StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native'
import React, { useRef, useEffect } from 'react'
import { s } from 'react-native-size-matters'
import { LinearGradient } from 'expo-linear-gradient'

interface Props {
  value?: 'forYou' | 'following';
  onFeedChange?: (feed: 'forYou' | 'following') => void;
}

const ExploreForuOrFollowing = ({ value = 'forYou', onFeedChange }: Props) => {
    const textArr = ['Following','For You'] as const
    const activeTab = value === 'forYou' ? 'For You' : 'Following'
    const pillAnim = useRef(new Animated.Value(0)).current

    useEffect(() => {
      pillAnim.setValue(0)
      Animated.spring(pillAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start()
    }, [value])

    const handlePress = (text: typeof textArr[number]) => {
      onFeedChange?.(text === 'For You' ? 'forYou' : 'following')
    }

    return (
      <View style={styles.wrapper}>
        <View style={styles.container}>
          {textArr.map((text) => (
            <TouchableOpacity
              key={text}
              style={styles.tabItem}
              onPress={() => handlePress(text)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.text,
                { color: activeTab === text ? '#FFFFFF' : '#9FA1A3' }
              ]}>
                {text}
              </Text>
              {activeTab === text && (
                <Animated.View style={[styles.pillContainer, { opacity: pillAnim, transform: [{ scaleX: pillAnim }] }]}>
                  <LinearGradient
                    colors={['#1B2351', '#47C0D2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.pill}
                  />
                </Animated.View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        alignItems: 'center',
        paddingVertical: s(8),
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: s(28),
    },
    tabItem: {
        alignItems: 'center',
    },
    text: {
        fontSize: s(17),
        fontWeight: '600',
        fontFamily: 'proxima-Nova',
    },
    pillContainer: {
        marginTop: 6,
        alignItems: 'center',
    },
    pill: {
        width: s(32),
        height: 3,
        borderRadius: 2,
    },
})

export default ExploreForuOrFollowing
