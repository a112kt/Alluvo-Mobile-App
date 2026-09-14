import React from "react";
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  ClipPath,
  Rect,
  SvgProps,
} from "react-native-svg";

export default function HeartIcon(props: SvgProps) {
  return (
    <Svg width={70} height={70} viewBox="0 0 70 70" fill="none" {...props}>
      <Defs>
        {/* paint0 */}
        <LinearGradient id="paint0" x1="18.1929" y1="36.8171" x2="51.7827" y2="36.8171" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#1B2351" />
          <Stop offset="100%" stopColor="#47C0D2" />
        </LinearGradient>

        {/* paint1 */}
        <LinearGradient id="paint1" x1="34.8633" y1="4.19856" x2="35.8633" y2="4.19856" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#1B2351" />
          <Stop offset="100%" stopColor="#47C0D2" />
        </LinearGradient>

        {/* paint2 */}
        <LinearGradient id="paint2" x1="17.3608" y1="8.45578" x2="21.5594" y2="8.45578" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#1B2351" />
          <Stop offset="100%" stopColor="#47C0D2" />
        </LinearGradient>

        {/* paint3 */}
        <LinearGradient id="paint3" x1="4.66895" y1="19.7087" x2="11.9409" y2="19.7087" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#1B2351" />
          <Stop offset="100%" stopColor="#47C0D2" />
        </LinearGradient>

        {/* paint4 */}
        <LinearGradient id="paint4" x1="0" y1="35.6455" x2="8.39713" y2="35.6455" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#1B2351" />
          <Stop offset="100%" stopColor="#47C0D2" />
        </LinearGradient>

        {/* paint5 */}
        <LinearGradient id="paint5" x1="4.81982" y1="50.5402" x2="12.0917" y2="50.5402" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#1B2351" />
          <Stop offset="100%" stopColor="#47C0D2" />
        </LinearGradient>

        {/* paint6 */}
        <LinearGradient id="paint6" x1="17.6094" y1="61.695" x2="21.8079" y2="61.695" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#1B2351" />
          <Stop offset="100%" stopColor="#47C0D2" />
        </LinearGradient>

        {/* paint7 */}
        <LinearGradient id="paint7" x1="35.1455" y1="65.8016" x2="36.1455" y2="65.8016" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#1B2351" />
          <Stop offset="100%" stopColor="#47C0D2" />
        </LinearGradient>

        {/* paint8 */}
        <LinearGradient id="paint8" x1="48.4409" y1="61.5525" x2="52.6395" y2="61.5525" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#1B2351" />
          <Stop offset="100%" stopColor="#47C0D2" />
        </LinearGradient>

        {/* paint9 */}
        <LinearGradient id="paint9" x1="58.0591" y1="50.2912" x2="65.331" y2="50.2912" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#1B2351" />
          <Stop offset="100%" stopColor="#47C0D2" />
        </LinearGradient>

        {/* paint10 */}
        <LinearGradient id="paint10" x1="61.603" y1="35.3633" x2="70.0002" y2="35.3633" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#1B2351" />
          <Stop offset="100%" stopColor="#47C0D2" />
        </LinearGradient>

        {/* paint11 */}
        <LinearGradient id="paint11" x1="57.9165" y1="19.4601" x2="65.1884" y2="19.4601" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#1B2351" />
          <Stop offset="100%" stopColor="#47C0D2" />
        </LinearGradient>

        {/* paint12 */}
        <LinearGradient id="paint12" x1="48.1919" y1="8.3049" x2="52.3905" y2="8.3049" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#1B2351" />
          <Stop offset="100%" stopColor="#47C0D2" />
        </LinearGradient>

        <ClipPath id="clip0">
          <Rect width="70" height="70" fill="white" />
        </ClipPath>
      </Defs>

      <Path
        d="M35.0046 52.3143L32.645 49.9379C23.9456 42.1958 18.1935 36.9727 18.1935 30.5573C18.1639 28.0986 19.1276 25.732 20.8663 23.9933C22.605 22.2546 24.9717 21.2909 27.4304 21.3205C30.3433 21.3537 33.0993 22.646 34.9878 24.8641C36.8763 22.646 39.6323 21.3537 42.5452 21.3205C45.0039 21.2909 47.3706 22.2546 49.1093 23.9933C50.848 25.732 51.8116 28.0986 51.782 30.5573C51.782 36.9727 46.072 42.1958 37.3306 49.9547L35.0046 52.3143Z"
        stroke="url(#paint0)"
        strokeWidth={3}
        strokeLinecap="round"
      />

      <Path d="M34.8633 0V8.39713" stroke="url(#paint1)" strokeWidth={3} strokeLinecap="round" />
      <Path d="M17.3608 4.81982L21.5594 12.0917" stroke="url(#paint2)" strokeWidth={3} strokeLinecap="round" />
      <Path d="M4.66895 17.6094L11.9409 21.8079" stroke="url(#paint3)" strokeWidth={3} strokeLinecap="round" />
      <Path d="M0 35.1455H8.39713" stroke="url(#paint4)" strokeWidth={3} strokeLinecap="round" />
      <Path d="M4.81982 52.6395L12.0917 48.4409" stroke="url(#paint5)" strokeWidth={3} strokeLinecap="round" />
      <Path d="M17.6094 65.331L21.8079 58.0591" stroke="url(#paint6)" strokeWidth={3} strokeLinecap="round" />
      <Path d="M35.1455 70.0002V61.603" stroke="url(#paint7)" strokeWidth={3} strokeLinecap="round" />
      <Path d="M52.6395 65.1884L48.4409 57.9165" stroke="url(#paint8)" strokeWidth={3} strokeLinecap="round" />
      <Path d="M65.331 52.3905L58.0591 48.1919" stroke="url(#paint9)" strokeWidth={3} strokeLinecap="round" />
      <Path d="M70.0002 34.8633H61.603" stroke="url(#paint10)" strokeWidth={3} strokeLinecap="round" />
      <Path d="M65.1884 17.3608L57.9165 21.5594" stroke="url(#paint11)" strokeWidth={3} strokeLinecap="round" />
      <Path d="M52.3905 4.66895L48.1919 11.9409" stroke="url(#paint12)" strokeWidth={3} strokeLinecap="round" />
    </Svg>
  );
}
