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

const ExploreIcon: React.FC<Props> = ({ size = 26, ...rest }) => {
  const active = rest.active;
  return (
    <Svg
      width={size}
      height={(size * 25) / 26}
      viewBox="0 0 26 25"
      fill="none"
      {...rest}
    >
      <G opacity={0.6} clipPath="url(#clip0_1510_3213)">
        <Path
          opacity={0.8}
          d="M19.5479 0C22.8351 0.000125752 25.4999 2.66492 25.5 5.95215V19.0479C25.4999 22.3351 22.8351 24.9999 19.5479 25H6.45215C3.16492 24.9999 0.500125 22.3351 0.5 19.0479V5.95215C0.500126 2.66492 3.16492 0.000125626 6.45215 0H19.5479ZM2.64258 19.0479C2.6427 21.1516 4.34839 22.8573 6.45215 22.8574H19.5479C21.6516 22.8573 23.3573 21.1516 23.3574 19.0479V8.33301H2.64258V19.0479ZM9.72656 11.2725C9.72659 10.8143 10.2223 10.5277 10.6191 10.7568L16.8691 14.3652C17.2659 14.5943 17.2658 15.1673 16.8691 15.3965L10.6191 19.0049C10.2223 19.234 9.72656 18.9475 9.72656 18.4893V11.2725ZM6.04102 2.16406C4.13058 2.36914 2.6427 3.98727 2.64258 5.95215V6.19043H9.26172L6.04102 2.16406ZM11.8965 6.10254L11.7383 6.19043H17L13.7617 2.14258H8.72949L11.8965 6.10254ZM19.6348 6.10254L19.4766 6.19043H23.3574V5.95215C23.3573 3.84839 21.6516 2.1427 19.5479 2.14258H16.4678L19.6348 6.10254Z"
          fill="url(#paint0_linear_1510_3213)"
        />
      </G>
      <Defs>
        <LinearGradient
          id="paint0_linear_1510_3213"
          x1="0.5"
          y1="12.5"
          x2="25.5"
          y2="12.5"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#1B2351" />
          <Stop offset={1} stopColor="#47C0D2" />
        </LinearGradient>

        <ClipPath id="clip0_1510_3213">
          <Rect
            width="25"
            height="25"
            fill="white"
            transform="translate(0.5)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default ExploreIcon;
