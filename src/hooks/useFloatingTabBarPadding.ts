import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TAB_BAR_BOTTOM_OFFSET = 16;

export function useFloatingTabBarPadding() {
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  return tabBarHeight + insets.bottom + TAB_BAR_BOTTOM_OFFSET;
}
