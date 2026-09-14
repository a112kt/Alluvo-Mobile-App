import React from "react";
import { View } from "react-native";
import Svg, { G, Rect, Mask, Path, Defs, ClipPath } from "react-native-svg";

export default function TimerIcon() {
  return (
    <View style={{marginTop:1}}>
      <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <G clipPath="url(#clip0_323_2735)">
          <Rect width="16" height="16" fill="black" fillOpacity="0.01" />
          <Mask id="mask0_323_2735" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
            <Rect width="16" height="16" fill="white" />
          </Mask>
          <G mask="url(#mask0_323_2735)">
            <Path
              d="M8 2C4.6875 2 2 4.6875 2 8C2 11.3125 4.6875 14 8 14C11.3125 14 14 11.3125 14 8C14 4.6875 11.3125 2 8 2Z"
              stroke="#1B2351"
            />
            <Path
              d="M8 4V8.5H11"
              stroke="#1B2351"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        </G>
        <Defs>
          <ClipPath id="clip0_323_2735">
            <Rect width="16" height="16" fill="white" />
          </ClipPath>
        </Defs>
      </Svg>
    </View>
  );
}
