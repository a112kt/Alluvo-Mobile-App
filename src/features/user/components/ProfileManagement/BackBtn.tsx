import * as React from "react";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
const BackBtn = (props:any) => (
  <Svg
    width={36}
    height={36}
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M22.5 27L14.2071 18.7071C13.8166 18.3166 13.8166 17.6834 14.2071 17.2929L22.5 9"
      stroke="url(#paint0_linear_806_8191)"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_806_8191"
        x1={18}
        y1={27}
        x2={18}
        y2={9}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#47C0D2" />
        <Stop offset={1} stopColor="#1B2351" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default BackBtn;
