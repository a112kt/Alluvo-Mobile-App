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
}
export default function AddIcon(props: SvgProps) {
  return (
    <Svg width={29} height={25} viewBox="0 0 29 25" fill="none" {...props}>
      <Defs>
        {/* BAG BORDER */}
        <LinearGradient id="paint0" x1="7.017" y1="12.213" x2="29" y2="12.213" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#1B2351" />
          <Stop offset="100%" stopColor="#47C0D2" />
        </LinearGradient>

        <LinearGradient id="paint1" x1="9.017" y1="5.38" x2="27" y2="5.38" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#1B2351" />
          <Stop offset="100%" stopColor="#47C0D2" />
        </LinearGradient>

        <LinearGradient id="paint2" x1="13.12" y1="12.21" x2="22.89" y2="12.21" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#1B2351" />
          <Stop offset="100%" stopColor="#47C0D2" />
        </LinearGradient>

        {/* CIRCLE */}
        <LinearGradient id="paint3" x1="0" y1="16" x2="18" y2="16" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#1B2351" />
          <Stop offset="100%" stopColor="#47C0D2" />
        </LinearGradient>

        {/* PLUS */}
        <LinearGradient id="paint4" x1="9.082" y1="16.08" x2="10.082" y2="16.08" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#1B2351" />
          <Stop offset="100%" stopColor="#47C0D2" />
        </LinearGradient>

        <LinearGradient id="paint5" x1="5.75" y1="16.58" x2="12.41" y2="16.58" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#1B2351" />
          <Stop offset="100%" stopColor="#47C0D2" />
        </LinearGradient>

        {/* CLIPS */}
        <ClipPath id="clip0">
          <Rect width="21.98" height="24.42" fill="white" x="7.017" />
        </ClipPath>
        <ClipPath id="clip1">
          <Rect width="18" height="18" fill="white" y="7" />
        </ClipPath>
        <ClipPath id="clip2">
          <Rect width="6.66" height="6.66" fill="white" x="5.75" y="12.75" />
        </ClipPath>
      </Defs>

      {/* BAG */}
      <G clipPath="url(#clip0)">
        <Path
          d="M24.8364 1L28.0005 5.21777V21.9834C28.0005 22.7801 27.3547 23.4257 26.5581 23.4258H9.45947C8.66285 23.4257 8.01709 22.7801 8.01709 21.9834V5.21777L11.1812 1H24.8364Z"
          stroke="url(#paint0)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M9.01709 4.88477H27.0005"
          stroke="url(#paint1)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M22.8934 9.77002C22.8934 12.468 20.7063 14.6552 18.0082 14.6552C15.3102 14.6552 13.123 12.468 13.123 9.77002"
          stroke="url(#paint2)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>

      {/* CIRCLE + PLUS */}
      <G clipPath="url(#clip1)">
        <Path
          d="M9 8C13.4183 8 17 11.5817 17 16C17 20.4183 13.4183 24 9 24C4.58172 24 1 20.4183 1 16C1 11.5817 4.58172 8 9 8Z"
          stroke="url(#paint3)"
          strokeWidth={2}
          fill="white"
        />

        <G clipPath="url(#clip2)">
          <Path
            d="M9.08203 12.752V19.4119"
            stroke="url(#paint4)"
            strokeWidth={2}
            strokeLinecap="round"
          />
          <Path
            d="M12.4119 16.082H5.75195"
            stroke="url(#paint5)"
            strokeWidth={2}
            strokeLinecap="round"
          />
        </G>
      </G>
    </Svg>
  );
}
