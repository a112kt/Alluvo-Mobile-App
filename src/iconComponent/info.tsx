import * as React from "react";
import Svg, {
  G,
  Rect,
  Mask,
  Path,
  Circle,
  Defs,
  ClipPath,
} from "react-native-svg";

const InfoIcon = ({ color }: { color: string }) => (
  <Svg width={21} height={21} viewBox="0 0 21 21" fill="none">
    <G clipPath="url(#clip0)">
      <Rect
        x={0.5}
        y={0.667}
        width={20}
        height={20}
        fill="black"
        fillOpacity={0.01}
      />
      <Mask
        id="mask0"
        maskUnits="userSpaceOnUse"
        x={0}
        y={0}
        width={21}
        height={21}
      >
        <Rect x={0.5} y={0.667} width={20} height={20} fill="white" />
      </Mask>

      <G clipPath="url(#clip1)">
        <Mask
          id="mask1"
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={21}
          height={21}
        >
          <Rect x={0.5} y={0.667} width={20} height={20} fill="white" />
        </Mask>

        <Path
          d="M10.5 3.792C8.601 3.792 6.981 4.463 5.639 5.806C4.296 7.148 3.625 8.769 3.625 10.667C3.625 12.566 4.296 14.186 5.639 15.528C6.981 16.871 8.602 17.542 10.5 17.542C12.398 17.542 14.019 16.871 15.361 15.528C16.704 14.186 17.375 12.566 17.375 10.667C17.375 8.769 16.704 7.148 15.361 5.806C14.019 4.463 12.398 3.792 10.5 3.792Z"
          stroke={color}
          strokeWidth={1.25}
        />
        <Path
          d="M8.313 8.569C8.313 8.569 8.345 7.885 9.077 7.297C9.511 6.947 10.031 6.846 10.5 6.839C10.927 6.833 11.308 6.904 11.536 7.013C11.927 7.199 12.688 7.653 12.688 8.618C12.688 9.633 12.023 10.095 11.267 10.602C10.51 11.11 10.305 11.66 10.305 12.23"
          stroke={color}
          strokeWidth={1.09375}
          strokeLinecap="round"
        />
        <Circle cx={10.266} cy={14.261} r={0.781} fill={color} />
      </G>
    </G>
    <Defs>
      <ClipPath id="clip0">
        <Rect
          width={20}
          height={20}
          fill="white"
          transform="translate(0.5 0.667)"
        />
      </ClipPath>
      <ClipPath id="clip1">
        <Rect
          width={20}
          height={20}
          fill="white"
          transform="translate(0.5 0.667)"
        />
      </ClipPath>
    </Defs>
  </Svg>
);

export default InfoIcon;
