import React from "react";
import Svg, {
  G,
  Path,
  Defs,
  LinearGradient,
  Stop,
  ClipPath,
  Rect
} from "react-native-svg";

export default function EmptyCart(props:any) {
  return (
    <Svg width={70} height={70} viewBox="0 0 70 70" fill="none" {...props}>
      <G clipPath="url(#clip)">
        <Path
          d="M47.25 23.585H42V21.835C42 19.9784 41.2625 18.198 39.9497 16.8852C38.637 15.5725 36.8565 14.835 35 14.835C33.1435 14.835 31.363 15.5725 30.0503 16.8852C28.7375 18.198 28 19.9784 28 21.835V23.585H22.75C22.2859 23.585 21.8408 23.7693 21.5126 24.0975C21.1844 24.4257 21 24.8708 21 25.335V44.585C21 45.9773 21.5531 47.3127 22.5377 48.2973C23.5223 49.2818 24.8576 49.835 26.25 49.835H43.75C45.1424 49.835 46.4777 49.2818 47.4623 48.2973C48.4469 47.3127 49 45.9773 49 44.585V25.335C49 24.8708 48.8156 24.4257 48.4874 24.0975C48.1593 23.7693 47.7141 23.585 47.25 23.585ZM31.5 21.835C31.5 20.9067 31.8687 20.0165 32.5251 19.3601C33.1815 18.7037 34.0717 18.335 35 18.335C35.9283 18.335 36.8185 18.7037 37.4749 19.3601C38.1313 20.0165 38.5 20.9067 38.5 21.835V23.585H31.5V21.835ZM45.5 44.585C45.5 45.0491 45.3156 45.4942 44.9874 45.8224C44.6593 46.1506 44.2141 46.335 43.75 46.335H26.25C25.7859 46.335 25.3408 46.1506 25.0126 45.8224C24.6844 45.4942 24.5 45.0491 24.5 44.585V27.085H28V28.835C28 29.2991 28.1844 29.7442 28.5126 30.0724C28.8408 30.4006 29.2859 30.585 29.75 30.585C30.2141 30.585 30.6592 30.4006 30.9874 30.0724C31.3156 29.7442 31.5 29.2991 31.5 28.835V27.085H38.5V28.835C38.5 29.2991 38.6844 29.7442 39.0126 30.0724C39.3408 30.4006 39.7859 30.585 40.25 30.585C40.7141 30.585 41.1592 30.4006 41.4874 30.0724C41.8156 29.7442 42 29.2991 42 28.835V27.085H45.5V44.585Z"
          fill="url(#grad0)"
        />
        <Path d="M34.863 0v8.397" stroke="url(#grad1)" strokeWidth={3} strokeLinecap="round" />
        <Path d="M17.361 4.82l4.198 7.272" stroke="url(#grad2)" strokeWidth={3} strokeLinecap="round" />
        <Path d="M4.669 17.609l7.272 4.199" stroke="url(#grad3)" strokeWidth={3} strokeLinecap="round" />
        <Path d="M0 35.145h8.397" stroke="url(#grad4)" strokeWidth={3} strokeLinecap="round" />
        <Path d="M4.82 52.639l7.272-4.198" stroke="url(#grad5)" strokeWidth={3} strokeLinecap="round" />
        <Path d="M17.609 65.331l4.199-7.272" stroke="url(#grad6)" strokeWidth={3} strokeLinecap="round" />
        <Path d="M35.145 70V61.603" stroke="url(#grad7)" strokeWidth={3} strokeLinecap="round" />
        <Path d="M52.639 65.188l-4.198-7.272" stroke="url(#grad8)" strokeWidth={3} strokeLinecap="round" />
        <Path d="M65.331 52.39l-7.272-4.198" stroke="url(#grad9)" strokeWidth={3} strokeLinecap="round" />
        <Path d="M70 34.863H61.603" stroke="url(#grad10)" strokeWidth={3} strokeLinecap="round" />
        <Path d="M65.188 17.361l-7.272 4.198" stroke="url(#grad11)" strokeWidth={3} strokeLinecap="round" />
        <Path d="M52.39 4.669l-4.198 7.272" stroke="url(#grad12)" strokeWidth={3} strokeLinecap="round" />
      </G>

      <Defs>
        <LinearGradient id="grad0" x1="21" y1="32.335" x2="49" y2="32.335">
          <Stop stopColor="#1B2351" />
          <Stop offset="1" stopColor="#47C0D2" />
        </LinearGradient>

        {[...Array(12)].map((_, i) => (
          <LinearGradient
            key={i}
            id={`grad${i + 1}`}
            x1="0"
            y1="0"
            x2="1"
            y2="0"
          >
            <Stop stopColor="#1B2351" />
            <Stop offset="1" stopColor="#47C0D2" />
          </LinearGradient>
        ))}

        <ClipPath id="clip">
          <Rect width={70} height={70} fill="#fff" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
