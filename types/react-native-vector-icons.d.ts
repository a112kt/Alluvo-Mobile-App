declare module 'react-native-vector-icons/*' {
  import * as React from 'react';
  import { TextProps } from 'react-native';

  export interface VectorIconProps extends TextProps {
    name?: string | number;
    size?: number;
    color?: string | undefined;
    style?: any;
    [key: string]: any;
  }

  const Icon: React.ComponentType<VectorIconProps>;
  export default Icon;
}
