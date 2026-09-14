import React from "react";
import Svg, { Path, Circle } from "react-native-svg";

export const PendingIcon = (props: { size?: number }) => {
  const size = props.size || 13;
  return (
    <Svg width={size} height={size} viewBox="0 0 13 13" fill="none">
      <Circle cx="6.5" cy="6.5" r="5.5" stroke="#9CA3AF" strokeWidth={1.2} />
      <Path
        d="M6.5 3.5V6.5L8.5 7.5"
        stroke="#9CA3AF"
        strokeWidth={1.2}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export const CheckedIcon2 = (props: { size?: number; color?: string }) => {
  const size = props.size || 11;
  const color = props.color || "#9CA3AF";
  return (
    <Svg width={size} height={size} viewBox="0 0 11 9" fill="none">
      <Path
        d="M3.2 7.2L1.1 5.1C0.9 4.9 0.6 4.9 0.4 5.1C0.2 5.3 0.2 5.6 0.4 5.8L2.9 8.3C3.1 8.5 3.4 8.5 3.6 8.3L10.1 1.8C10.3 1.6 10.3 1.3 10.1 1.1C9.9 0.9 9.6 0.9 9.4 1.1L3.2 7.2Z"
        fill={color}
      />
    </Svg>
  );
};

export const DoubleCheckedIcon = (props: {
  size?: number;
  color?: string;
}) => {
  const size = props.size || 11;
  const color = props.color || "#9CA3AF";
  return (
    <Svg width={size * 2} height={size} viewBox="0 0 22 9" fill="none">
      <Path
        d="M3.2 7.2L1.1 5.1C0.9 4.9 0.6 4.9 0.4 5.1C0.2 5.3 0.2 5.6 0.4 5.8L2.9 8.3C3.1 8.5 3.4 8.5 3.6 8.3L10.1 1.8C10.3 1.6 10.3 1.3 10.1 1.1C9.9 0.9 9.6 0.9 9.4 1.1L3.2 7.2Z"
        fill={color}
      />
      <Path
        d="M13.2 7.2L11.1 5.1C10.9 4.9 10.6 4.9 10.4 5.1C10.2 5.3 10.2 5.6 10.4 5.8L12.9 8.3C13.1 8.5 13.4 8.5 13.6 8.3L20.1 1.8C20.3 1.6 20.3 1.3 20.1 1.1C19.9 0.9 19.6 0.9 19.4 1.1L13.2 7.2Z"
        fill={color}
      />
    </Svg>
  );
};
