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
  active?: boolean;
}

const CartIcon: React.FC<Props> = ({ size = 26, active = false, ...rest }) => {
  const height = Math.round((size * 25) / 26);

  return (
    <Svg
      width={size}
      height={height}
      viewBox="0 0 26 25"
      fill="none"
      {...rest}
    >
      <G clipPath="url(#clip0_cart_1510_3220)">
        <G opacity={active ? 1 : 0.6} clipPath="url(#clip1_cart_1510_3220)">
          <Path
            d="M23.6875 6.25H19V5C19 3.67392 18.3415 2.40215 17.1694 1.46447C15.9973 0.526784 14.4076 0 12.75 0C11.0924 0 9.50268 0.526784 8.33058 1.46447C7.15848 2.40215 6.5 3.67392 6.5 5V6.25H1.8125C1.3981 6.25 1.00067 6.3817 0.707646 6.61612C0.41462 6.85054 0.25 7.16848 0.25 7.5L0.25 21.25C0.25 22.2446 0.74386 23.1984 1.62294 23.9017C2.50201 24.6049 3.6943 25 4.9375 25H20.5625C21.8057 25 22.998 24.6049 23.8771 23.9017C24.7561 23.1984 25.25 22.2446 25.25 21.25V7.5C25.25 7.16848 25.0854 6.85054 24.7924 6.61612C24.4993 6.3817 24.1019 6.25 23.6875 6.25ZM9.625 5C9.625 4.33696 9.95424 3.70107 10.5403 3.23223C11.1263 2.76339 11.9212 2.5 12.75 2.5C13.5788 2.5 14.3737 2.76339 14.9597 3.23223C15.5458 3.70107 15.875 4.33696 15.875 5V6.25H9.625V5ZM22.125 21.25C22.125 21.5815 21.9604 21.8995 21.6674 22.1339C21.3743 22.3683 20.9769 22.5 20.5625 22.5H4.9375C4.5231 22.5 4.12567 22.3683 3.83265 22.1339C3.53962 21.8995 3.375 21.5815 3.375 21.25L3.375 8.75H6.5V10C6.5 10.3315 6.66462 10.6495 6.95765 10.8839C7.25067 11.1183 7.6481 11.25 8.0625 11.25C8.4769 11.25 8.87433 11.1183 9.16735 10.8839C9.46038 10.6495 9.625 10.3315 9.625 10V8.75H15.875V10C15.875 10.3315 16.0396 10.6495 16.3326 10.8839C16.6257 11.1183 17.0231 11.25 17.4375 11.25C17.8519 11.25 18.2493 11.1183 18.5424 10.8839C18.8354 10.6495 19 10.3315 19 10V8.75H22.125V21.25Z"
            fill="url(#paint0_cart_1510_3220)"
          />
        </G>
      </G>

      <Defs>
        <LinearGradient
          id="paint0_cart_1510_3220"
          x1={0.25}
          y1={12.5}
          x2={25.25}
          y2={12.5}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#1B2351" />
          <Stop offset={1} stopColor="#47C0D2" />
        </LinearGradient>

        <ClipPath id="clip0_cart_1510_3220">
          <Rect width={25} height={25} fill="white" transform="translate(0.25)" />
        </ClipPath>

        <ClipPath id="clip1_cart_1510_3220">
          <Rect width={25} height={25} fill="white" transform="translate(0.25)" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default CartIcon;

