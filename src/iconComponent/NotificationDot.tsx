import * as React from "react";
import Svg, { Circle } from "react-native-svg";
const NotificationDot = (props:any) => (
  <Svg
    width={8}
    height={8}
    viewBox="0 0 8 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Circle cx={4} cy={4} r={3.5} fill={props.color} stroke={props.stroke} />
  </Svg>
);
export default NotificationDot;