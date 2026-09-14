import * as React from "react";
import Svg, { Path } from "react-native-svg";
const CheckIcon = (props: any) => (
    <Svg
        width={props.width || 13}
        height={props.height || 10}
        viewBox="0 0 13 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M3.87938 7.62187L1.27688 5.01937C0.984375 4.72687 0.511875 4.72687 0.219375 5.01937C-0.073125 5.31187 -0.073125 5.78437 0.219375 6.07687L3.35438 9.21188C3.64688 9.50438 4.11938 9.50438 4.41188 9.21188L12.3469 1.27687C12.6394 0.984375 12.6394 0.511875 12.3469 0.219375C12.0544 -0.073125 11.5819 -0.073125 11.2894 0.219375L3.87938 7.62187Z"
            fill={props.fill || "white"}
        />
        
    </Svg>
);
export default CheckIcon;
