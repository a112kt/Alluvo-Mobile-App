import { useSafeAreaInsets } from "react-native-safe-area-context";

const TAB_BAR_HEIGHT = 64;
const TAB_BAR_BOTTOM_OFFSET = 16;

export function useBrandTabBarPadding() {
  const insets = useSafeAreaInsets();
  return TAB_BAR_HEIGHT + TAB_BAR_BOTTOM_OFFSET + insets.bottom;
}
