import * as React from "react";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
const CheckIcon = (props:any) => (
  <Svg
    width={26}
    height={26}
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M13 1C19.6274 1 25 6.37258 25 13C25 19.6274 19.6274 25 13 25C6.37258 25 1 19.6274 1 13C1 6.37258 6.37258 1 13 1Z"
      fill="url(#paint0_linear_806_8286)"
      stroke="white"
      strokeWidth={2}
    />
    <Path
      d="M17.0238 10.6089L12.2416 15.3911L10.0679 13.2174"
      stroke="white"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_806_8286"
        x1={2}
        y1={13}
        x2={24}
        y2={13}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#47C0D2" />
        <Stop offset={1} stopColor="#1B2351" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default CheckIcon;
