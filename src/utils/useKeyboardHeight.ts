import { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  Platform,
  KeyboardEvent,
  EmitterSubscription,
} from "react-native";

export function useKeyboardHeight() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const keyboardHeightRef = useRef(0);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub: EmitterSubscription = Keyboard.addListener(
      showEvent,
      (e: KeyboardEvent) => {
        const height = e.endCoordinates.height;
        keyboardHeightRef.current = height;
        setKeyboardHeight(height);
        setIsKeyboardVisible(true);
      },
    );

    const hideSub: EmitterSubscription = Keyboard.addListener(
      hideEvent,
      () => {
        keyboardHeightRef.current = 0;
        setKeyboardHeight(0);
        setIsKeyboardVisible(false);
      },
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return { keyboardHeight, isKeyboardVisible, keyboardHeightRef };
}
