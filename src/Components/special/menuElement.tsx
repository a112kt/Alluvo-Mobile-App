import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Modal,
  Pressable,
  ScrollView,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { TouchableRipple } from 'react-native-paper';

interface AnchorPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface MenuElementProps {
  options: string[];
  getter: string;
  setter: (val: string) => void;
  visible: boolean;
  onDismiss: () => void;
  anchorPosition: AnchorPosition;
}

const WINDOW = Dimensions.get('window');
const EDGE_MARGIN = 12;
const MENU_MIN_WIDTH = 150;
const MENU_MAX_HEIGHT = 280;
const ITEM_HEIGHT = 48;

export default function MenuElement({
  options,
  getter,
  setter,
  visible,
  onDismiss,
  anchorPosition,
}: MenuElementProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-8)).current;
  const scale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      opacity.setValue(0);
      translateY.setValue(-8);
      scale.setValue(0.95);
    }
  }, [visible]);

  const estimatedMenuWidth = Math.max(
    MENU_MIN_WIDTH,
    Math.min(
      ...options.map(o => o.length * 10 + 40),
      WINDOW.width - EDGE_MARGIN * 2,
    ),
  );

  const estimatedMenuHeight = Math.min(
    options.length * ITEM_HEIGHT + 16,
    MENU_MAX_HEIGHT,
  );

  let posTop: number;
  let posLeft: number;
  const spaceBelow = WINDOW.height - (anchorPosition.y + anchorPosition.height);
  const spaceAbove = anchorPosition.y;
  const fitsBelow = spaceBelow >= estimatedMenuHeight + 8;
  const fitsAbove = spaceAbove >= estimatedMenuHeight + 8;

  if (fitsBelow) {
    posTop = anchorPosition.y + anchorPosition.height + 4;
  } else if (fitsAbove) {
    posTop = anchorPosition.y - estimatedMenuHeight - 4;
  } else {
    posTop = anchorPosition.y + anchorPosition.height + 4;
  }

  const rightEdge = anchorPosition.x + estimatedMenuWidth;
  const overflowsRight = rightEdge > WINDOW.width - EDGE_MARGIN;
  if (overflowsRight) {
    posLeft = WINDOW.width - estimatedMenuWidth - EDGE_MARGIN;
  } else {
    posLeft = anchorPosition.x;
  }

  posLeft = Math.max(EDGE_MARGIN, posLeft);
  posTop = Math.max(EDGE_MARGIN, posTop);

  const isAbove = !fitsBelow && fitsAbove;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onDismiss}
      statusBarTranslucent={true}
    >
      <Pressable style={styles.backdrop} onPress={onDismiss}>
        <Animated.View
          style={[
            styles.menuContainer,
            {
              top: posTop,
              left: posLeft,
              minWidth: estimatedMenuWidth,
              maxHeight: MENU_MAX_HEIGHT,
              opacity: opacity,
              transform: [
                { translateY: translateY },
                { scale: scale },
              ],
            },
            isAbove && styles.menuContainerAbove,
          ]}
        >
          <ScrollView
            bounces={false}
            showsVerticalScrollIndicator={true}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            nestedScrollEnabled={true}
          >
            {options.map((option) => {
              const isSelected = getter === option;
              return (
                <TouchableRipple
                  key={option}
                  onPress={() => {
                    setter(option);
                    onDismiss();
                  }}
                  rippleColor="#1B235118"
                  style={[
                    styles.menuItem,
                    isSelected && styles.selectedMenuItem,
                  ]}
                >
                  <View style={styles.itemInner}>
                    <View style={[styles.selectionIndicator, isSelected && styles.visibleIndicator]} />
                    <Text
                      style={[
                        styles.menuItemText,
                        isSelected && styles.selectedMenuItemText,
                      ]}
                      numberOfLines={1}
                    >
                      {option}
                    </Text>
                  </View>
                </TouchableRipple>
              );
            })}
          </ScrollView>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  menuContainer: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  menuContainerAbove: {
    shadowOffset: { width: 0, height: -4 },
  },
  scrollView: {
    maxHeight: MENU_MAX_HEIGHT,
  },
  scrollContent: {
    paddingRight: 4,
  },
  menuItem: {
    height: 44,
    justifyContent: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  selectedMenuItem: {
    backgroundColor: '#1B23510F',
  },
  itemInner: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  selectionIndicator: {
    width: 4,
    height: '60%',
    backgroundColor: 'transparent',
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  visibleIndicator: {
    backgroundColor: '#1B2351',
  },
  menuItemText: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#30343C',
    marginLeft: 12,
    flex: 1,
  },
  selectedMenuItemText: {
    color: '#1B2351',
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});
