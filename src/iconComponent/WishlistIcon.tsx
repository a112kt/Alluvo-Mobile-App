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

const WishlistIcon: React.FC<Props> = ({ size = 26, ...rest }) => {
  return (
    <Svg
      width={size}
      height={(size * 25) / 26}
      viewBox="0 0 26 25"
      fill="none"
      {...rest}
    >
      <G clipPath="url(#clip0_1510_3209)">
        <G opacity={0.6} clipPath="url(#clip1_1510_3209)">
          <Path
            d="M13.2521 2.06979C14.6804 0.687235 16.5436 -0.0511816 18.4593 0.00615874C20.375 0.063499 22.1977 0.912245 23.5532 2.37812C24.9072 3.84296 25.6921 5.81271 25.7469 7.8836C25.8018 9.95449 25.1224 11.9696 23.8482 13.516L13.2496 25L2.65347 13.516C1.37771 11.9688 0.69773 9.95196 0.753139 7.8794C0.808548 5.80685 1.59514 3.83587 2.95142 2.37113C4.30771 0.906382 6.13077 0.0590061 8.04634 0.00296709C9.9619 -0.0530719 11.8246 0.686478 13.2521 2.06979ZM21.7834 4.28897C20.8802 3.31335 19.6664 2.74843 18.3906 2.70996C17.1149 2.67149 15.8739 3.16239 14.9218 4.08206L13.2533 5.70216L11.5835 4.08342C10.6358 3.16639 9.40065 2.67455 8.12958 2.70798C6.8585 2.74142 5.64695 3.29762 4.74147 4.2634C3.83599 5.22919 3.30462 6.53198 3.25548 7.90668C3.20635 9.28138 3.64314 10.6247 4.47698 11.6633L13.2508 21.1715L22.0247 11.6646C22.855 10.6306 23.2919 9.2943 23.2471 7.92537C23.2023 6.55644 22.6792 5.25687 21.7834 4.28897Z"
            fill="url(#paint0_linear_1510_3209)"
          />
        </G>
      </G>
      <Defs>
        <LinearGradient
          id="paint0_linear_1510_3209"
          x1="0.75"
          y1="12.5"
          x2="25.75"
          y2="12.5"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#1B2351" />
          <Stop offset={1} stopColor="#47C0D2" />
        </LinearGradient>

        <ClipPath id="clip0_1510_3209">
          <Rect width="25" height="25" fill="white" transform="translate(0.75)" />
        </ClipPath>

        <ClipPath id="clip1_1510_3209">
          <Rect width="25" height="25" fill="white" transform="translate(0.75)" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default WishlistIcon;
