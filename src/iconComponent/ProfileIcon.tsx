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

const ProfileIcon: React.FC<Props> = ({ size = 25, active = false, ...rest }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 25 25"
      fill="none"
      {...rest}
    >
      <G opacity={active ? 1 : 0.6} clipPath="url(#clip0_profile)">
        <G clipPath="url(#clip1_profile)">
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M20.3913 6.95022C20.3913 10.7887 16.8582 13.9004 12.5 13.9004C8.14176 13.9004 4.60872 10.7887 4.60872 6.95022C4.60872 3.11172 8.14176 0 12.5 0C16.8582 0 20.3913 3.11172 20.3913 6.95022ZM17.6465 6.95022C17.6465 9.4536 15.3423 11.483 12.5 11.483C9.65767 11.483 7.35351 9.4536 7.35351 6.95022C7.35351 4.44685 9.65767 2.41747 12.5 2.41747C15.3423 2.41747 17.6465 4.44685 17.6465 6.95022Z"
            fill="url(#paint0_profile)"
          />
          <Path
            d="M0.028156 23.8396C-0.074673 24.1363 0.113211 24.4467 0.44421 24.5528L1.7249 24.9633C2.11365 25.0879 2.53667 24.8826 2.658 24.5342C3.94932 20.8267 7.86722 18.131 12.5 18.131C17.1327 18.131 21.0507 20.8267 22.342 24.5342C22.4633 24.8826 22.8864 25.0879 23.2751 24.9633L24.5558 24.5528C24.8868 24.4467 25.0747 24.1363 24.9718 23.8396C23.3416 19.1355 18.3745 15.7136 12.5 15.7136C6.62545 15.7136 1.65837 19.1355 0.028156 23.8396Z"
            fill="url(#paint1_profile)"
          />
        </G>
      </G>

      <Defs>
        <LinearGradient
          id="paint0_profile"
          x1={0}
          y1={12.5}
          x2={25}
          y2={12.5}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#1B2351" />
          <Stop offset={1} stopColor="#47C0D2" />
        </LinearGradient>

        <LinearGradient
          id="paint1_profile"
          x1={0}
          y1={12.5}
          x2={25}
          y2={12.5}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#1B2351" />
          <Stop offset={1} stopColor="#47C0D2" />
        </LinearGradient>

        <ClipPath id="clip0_profile">
          <Rect width={25} height={25} fill="white" />
        </ClipPath>

        <ClipPath id="clip1_profile">
          <Rect width={25} height={25} fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default ProfileIcon;
