import React from "react";
import Svg, { Path } from "react-native-svg";

const Trash = () => {
  return (
    <Svg width={16} height={17} viewBox="0 0 16 17" fill="none">
      <Path
        d="M10.6182 15.568H5.38424C4.72759 15.5573 4.10135 15.2894 3.64006 14.8219C3.17877 14.3545 2.91925 13.7247 2.91724 13.068L2.09424 3.5H13.9822L13.1602 13.063C13.1552 13.7322 12.8846 14.3721 12.4079 14.8418C11.9312 15.3116 11.2875 15.5728 10.6182 15.568V15.568Z"
        stroke="#D97474"
        strokeMiterlimit={10}
      />
      <Path
        d="M5.95215 6.53613V12.5321"
        stroke="#D97474"
        strokeMiterlimit={10}
        strokeLinecap="round"
      />
      <Path
        d="M10.0513 6.53613V12.5321"
        stroke="#D97474"
        strokeMiterlimit={10}
        strokeLinecap="round"
      />
      <Path
        d="M3.08123 3.5C3.05039 3.13659 3.09149 2.77066 3.20219 2.42314C3.31288 2.07562 3.49099 1.75334 3.72634 1.47471C3.96168 1.19609 4.24965 0.966585 4.57376 0.799336C4.89787 0.632086 5.25177 0.530369 5.61523 0.5H10.4602C11.1813 0.578564 11.8429 0.936756 12.3028 1.49766C12.7628 2.05857 12.9844 2.77747 12.9202 3.5H3.08123Z"
        stroke="#D97474"
        strokeMiterlimit={10}
      />
      <Path
        d="M0.5 3.5H15.5"
        stroke="#D97474"
        strokeMiterlimit={10}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default Trash;
