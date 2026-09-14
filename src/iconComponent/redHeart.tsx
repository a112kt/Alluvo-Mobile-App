import React from "react";
import Svg, { Path } from "react-native-svg";

interface Props {
  size?: number;
  color?: string;
  active?: boolean;
}

const HeartIcon: React.FC<Props> = ({ size = 24, color = "#EF4444", active = false }) => {
  return (
    <Svg width={size} height={size} viewBox="-1 -1 10 10" fill="none">
      <Path
        d="M4.54143 6.85226C4.23743 7.12826 3.76943 7.12826 3.46543 6.84826L3.42143 6.80826C1.32143 4.90826 -0.0505716 3.66426 0.00142842 2.11226C0.0254284 1.43226 0.373428 0.780262 0.937428 0.396262C1.99343 -0.323738 3.29743 0.0122617 4.00143 0.836262C4.70543 0.0122617 6.00943 -0.327738 7.06543 0.396262C7.62943 0.780262 7.97743 1.43226 8.00143 2.11226C8.05743 3.66426 6.68143 4.90826 4.58143 6.81626L4.54143 6.85226Z"
        fill={active ? color : "none"}
        stroke={active ? "none" : color}
        strokeWidth={active ? 0 : 0.6}
      />
    </Svg>
  );
};

export default HeartIcon;
