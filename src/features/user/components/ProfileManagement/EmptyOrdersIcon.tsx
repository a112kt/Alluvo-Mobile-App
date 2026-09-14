import React from "react";
import Svg, { Path, Circle, G } from "react-native-svg";
import { scale } from "react-native-size-matters";

interface Props {
  size?: number;
}

const EmptyOrdersIcon = ({ size = scale(160) }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 200 200" fill="none">
    <G opacity={0.9}>
      <Path
        d="M50 85H150L155 145C155 152 148 158 141 158H59C52 158 45 152 45 145L50 85Z"
        fill="#E8F4F8"
        stroke="#1B2351"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <Path
        d="M65 85V65C65 53 75 42 100 42C125 42 135 53 135 65V85"
        stroke="#1B2351"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <Circle cx="80" cy="118" r="10" fill="#47C0D2" opacity={0.35} />
      <Circle cx="120" cy="112" r="14" fill="#1B2351" opacity={0.15} />
      <Path
        d="M85 130L100 122L115 132"
        stroke="#47C0D2"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="45" cy="170" r="4" fill="#47C0D2" opacity={0.5} />
      <Circle cx="158" cy="172" r="5" fill="#1B2351" opacity={0.2} />
      <Circle cx="165" cy="30" r="4" fill="#47C0D2" opacity={0.4} />
      <Circle cx="38" cy="38" r="3" fill="#1B2351" opacity={0.25} />
    </G>
  </Svg>
);

export default EmptyOrdersIcon;
