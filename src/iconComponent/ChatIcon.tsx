import React from "react";
import Svg, { Circle, Path, SvgProps } from "react-native-svg";

interface Props extends SvgProps {
  size?: number;
  active?: boolean;
}

const ChatIcon: React.FC<Props> = ({ size = 24, active = false, ...rest }) => {
  const color = active ? "#1B2351" : "#9CA3AF";

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      <Circle cx="12" cy="12" r="10.5" stroke={color} strokeWidth={1.5} />
      <Path
        d="M12 5C8.13401 5 5 7.68629 5 11C5 12.783 5.81556 14.3869 7.12132 15.5355L6.5 18.5L9.71429 17.4286C10.4471 17.7958 11.2448 18 12 18C15.866 18 19 15.3137 19 12C19 8.68629 15.866 5 12 5Z"
        fill={color}
      />
    </Svg>
  );
};

export default ChatIcon;
