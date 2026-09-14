import React from "react";
import Svg, {
  G,
  Path,
  Defs,
  LinearGradient,
  Stop,
  ClipPath,
  Rect,
  SvgProps,
} from "react-native-svg";

interface Props extends SvgProps {
  size?: number;
}

const MinusCircle: React.FC<Props> = ({ size = 20, ...rest }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      {...rest}
    >
      {/* Outer Circle */}
      <Path
        d="M10 1C14.9706 1 19 5.02944 19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1Z"
        stroke="url(#paint_circle)"
        strokeWidth={2}
      />

      {/* Minus sign */}
      <G clipPath="url(#clip_minus)">
        <Path
          d="M16 10H4"
          stroke="url(#paint_minus)"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </G>

      <Defs>
        {/* Circle gradient */}
        <LinearGradient
          id="paint_circle"
          x1="0"
          y1="10"
          x2="20"
          y2="10"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#1B2351" />
          <Stop offset={1} stopColor="#47C0D2" />
        </LinearGradient>

        {/* Horizontal minus gradient */}
        <LinearGradient
          id="paint_minus"
          x1="4"
          y1="10"
          x2="16"
          y2="10"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#1B2351" />
          <Stop offset={1} stopColor="#47C0D2" />
        </LinearGradient>

        {/* Clip area */}
        <ClipPath id="clip_minus">
          <Rect width="12" height="12" fill="white" x="4" y="4" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default MinusCircle;
