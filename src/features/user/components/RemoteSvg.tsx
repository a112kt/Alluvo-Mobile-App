import React, { useEffect, useState } from "react";
import { View, Image, ActivityIndicator } from "react-native";
import { SvgXml } from "react-native-svg";
import axios from "axios";

interface RemoteSvgProps {
  uri: string;
  width: number;
  height: number;
  fallback: any;
  style?: any;
}

const RemoteSvg = ({ uri, width, height, fallback, style }: RemoteSvgProps) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const fetchSvg = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await axios.get(uri, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": "https://commons.wikimedia.org/",
            Accept: "image/svg+xml,text/plain,*/*",
          },
          timeout: 10000,
        });

        if (isMounted) {

          if (typeof response.data === "string" && (response.data.includes("<svg") || response.data.includes("<?xml"))) {
            setSvgContent(response.data);
          } else {
            console.error("RemoteSvg: Content is not a valid SVG:", uri, response.data?.substring(0, 100));
            setError(true);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching remote SVG:", uri, err);
          setError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSvg();

    return () => {
      isMounted = false;
    };
  }, [uri]);

  if (loading) {
    return (
      <View style={[style, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="small" color="#fff" />
      </View>
    );
  }

  if (error || !svgContent) {
    return <Image source={fallback} style={style} />;
  }

  return (
    <View style={style}>
      <SvgXml xml={svgContent} width={width} height={height} />
    </View>
  );
};

export default RemoteSvg;
