import * as React from "react";
import Svg, { Path } from "react-native-svg";
const BackArrow = (props:any) => (
  <Svg
    width={8}
    height={14}
    viewBox="0 0 8 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M6.33594 12.75L1.04304 7.45711C0.65252 7.06658 0.65252 6.43342 1.04304 6.04289L6.33594 0.75"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default BackArrow;