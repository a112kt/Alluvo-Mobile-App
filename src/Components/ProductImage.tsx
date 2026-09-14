import React, { useState, useEffect } from "react";
import { Image, ImageProps, ImageStyle, StyleProp, ImageSourcePropType } from "react-native";
import { getProductImageUri, PLACEHOLDER } from "../utils/imageUtils";

interface ProductImageProps extends Omit<ImageProps, "source"> {
  item: any;
  fallback?: ImageSourcePropType;
}

export default function ProductImage({
  item,
  fallback,
  style,
  ...rest
}: ProductImageProps) {
  const uri = getProductImageUri(item);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [uri]);

  const source = hasError || !uri ? fallback || PLACEHOLDER : { uri };

  return (
    <Image
      source={source}
      style={style as StyleProp<ImageStyle>}
      onError={() => {
        setHasError(true);
      }}
      {...rest}
    />
  );
}
