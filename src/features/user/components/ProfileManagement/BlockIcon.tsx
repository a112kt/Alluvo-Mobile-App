import * as React from "react";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
const BlockIcon = (props:any) => (
  <Svg
    width={25}
    height={25}
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.4997 2.08325C18.2526 2.08325 22.9164 6.74697 22.9164 12.4999C22.9164 18.2529 18.2526 22.9166 12.4997 22.9166C6.74673 22.9166 2.08301 18.2529 2.08301 12.4999C2.08301 6.74697 6.74673 2.08325 12.4997 2.08325ZM4.16636 12.4999C4.16636 17.1023 7.89732 20.8333 12.4997 20.8333C14.4254 20.8333 16.1986 20.18 17.6097 19.0831L5.9165 7.38989C4.81948 8.80103 4.16636 10.5741 4.16636 12.4999ZM12.4997 4.1666C10.5739 4.1666 8.80078 4.81978 7.38965 5.91675L19.0829 17.61C20.1798 16.1988 20.833 14.4257 20.833 12.4999C20.833 7.89756 17.1021 4.1666 12.4997 4.1666Z"
      fill="url(#paint0_linear_806_7075)"
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_806_7075"
        x1={2.08301}
        y1={12.4999}
        x2={22.9164}
        y2={12.4999}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#47C0D2" />
        <Stop offset={1} stopColor="#1B2351" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default BlockIcon;
