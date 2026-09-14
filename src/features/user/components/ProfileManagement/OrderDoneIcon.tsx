import * as React from "react";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
const OrderDone = (props:any) => (
  <Svg
    width={25}
    height={25}
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M21.875 7.2915V12.4998M3.125 7.2915V17.8759C3.125 19.3165 5.15208 20.1728 9.20521 21.8842C10.8333 22.5728 11.6479 22.9165 12.5 22.9165V11.828M15.625 19.7915C15.625 19.7915 16.5365 19.7915 17.4479 21.8748C17.4479 21.8748 20.3437 16.6665 22.9167 15.6248"
      stroke="url(#paint0_linear_806_7071)"
      strokeWidth={1.5625}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6.25 12.4999L8.33333 13.5416M17.7083 4.16659L7.29167 9.37492M8.67292 10.0947L5.63021 8.62283C3.96042 7.8145 3.125 7.41034 3.125 6.77075C3.125 6.13117 3.96042 5.727 5.63021 4.91867L8.67187 3.44679C10.5521 2.53742 11.4896 2.08325 12.5 2.08325C13.5104 2.08325 14.449 2.53742 16.3271 3.44679L19.3698 4.91867C21.0396 5.727 21.875 6.13117 21.875 6.77075C21.875 7.41034 21.0396 7.8145 19.3698 8.62283L16.3281 10.0947C14.4479 11.0041 13.5104 11.4583 12.5 11.4583C11.4896 11.4583 10.551 11.0041 8.67292 10.0947Z"
      stroke="url(#paint1_linear_806_7071)"
      strokeWidth={1.5625}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_806_7071"
        x1={3.125}
        y1={15.104}
        x2={22.9167}
        y2={15.104}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#47C0D2" />
        <Stop offset={1} stopColor="#1B2351" />
      </LinearGradient>
      <LinearGradient
        id="paint1_linear_806_7071"
        x1={3.125}
        y1={7.81242}
        x2={21.875}
        y2={7.81242}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#47C0D2" />
        <Stop offset={1} stopColor="#1B2351" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default OrderDone;
