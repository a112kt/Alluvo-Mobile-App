import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, View, Text, Animated, Dimensions, StatusBar, Platform, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { lightColors } from "../../theme";

const { width } = Dimensions.get('window');

export interface ToastRef {
  show: (title: string, message: string, onPress?: () => void, type?: 'success' | 'warning' | 'error' | 'info') => void;
}

const NotificationToast = forwardRef<ToastRef>((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [onPress, setOnPress] = useState<(() => void) | undefined>(undefined);
  const [toastType, setToastType] = useState<'success' | 'warning' | 'error' | 'info' | undefined>(undefined);
  
  const translateY = React.useRef(new Animated.Value(-150)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;

  useImperativeHandle(ref, () => ({
    show: (newTitle: string, newMessage: string, newOnPress?: () => void, newType?: 'success' | 'warning' | 'error' | 'info') => {
      setTitle(newTitle);
      setMessage(newMessage);
      setOnPress(() => newOnPress);
      setToastType(newType);
      showToast();
    },
  }));

  const showToast = () => {
    setVisible(true);
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        hideToast();
      }, 5000);
    });
  };

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -150,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
      setOnPress(undefined);
      setToastType(undefined);
    });
  };

  if (!visible) return null;

  const isWarning = toastType === 'warning' || toastType === 'error';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <SafeAreaView edges={['top']}>
        <Pressable 
          style={[styles.toast, isWarning && styles.warningToast, { backgroundColor: lightColors.bgBottomSheet }]} 
          onPress={() => {
            if (onPress) onPress();
            hideToast();
          }}
        >
            <View style={[styles.iconContainer, isWarning && styles.warningIconContainer, !isWarning && { backgroundColor: lightColors.bgLight }]}>
              <View style={[styles.iconCircle, isWarning && styles.warningIconCircle, !isWarning && { backgroundColor: lightColors.primary }]}>
                <Text style={[styles.iconText, { color: lightColors.white }]}>A</Text>
            </View>
          </View>
          <View style={styles.content}>
            <Text style={[styles.title, isWarning && styles.warningTitle, !isWarning && { color: lightColors.primary }]}>{title}</Text>
            <Text style={[styles.message, isWarning && styles.warningMessage, !isWarning && { color: lightColors.body }]} numberOfLines={2}>{message}</Text>
          </View>
        </Pressable>
      </SafeAreaView>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight || 20,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: 20,
  },
  toast: {
    borderRadius: 20,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(27, 35, 81, 0.05)',
  },
  warningToast: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  warningIconContainer: {
    backgroundColor: '#FEE2E2',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningIconCircle: {
    backgroundColor: '#EF4444',
  },
  iconText: {
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    marginBottom: 2,
  },
  warningTitle: {
    color: '#991B1B',
  },
  message: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    lineHeight: 18,
  },
  warningMessage: {
    color: '#B91C1C',
  },
});

export default NotificationToast;
