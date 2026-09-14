import * as React from "react";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
const FilterIcon = (props: any) => (
    <Svg
        width={16}
        height={16}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M0.211604 1.61C2.5316 4.59 5.9616 9 5.9616 9V14C5.9616 15.1 6.8616 16 7.9616 16C9.0616 16 9.9616 15.1 9.9616 14V9C9.9616 9 13.3916 4.59 15.7116 1.61C16.2216 0.95 15.7516 0 14.9116 0H1.0016C0.171604 0 -0.298396 0.95 0.211604 1.61Z"
            fill="url(#paint0_linear_3219_3299)"
        />
        <Defs>
            <LinearGradient
                id="paint0_linear_3219_3299"
                x1={7.96149}
                y1={0}
                x2={7.96149}
                y2={16}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#1B2351" />
                <Stop offset={1} stopColor="#47C0D2" />
            </LinearGradient>
        </Defs>
    </Svg>
);
export default FilterIcon;
