import React from "react";
import { useWindowDimensions } from "react-native";
import RenderHtml, { defaultSystemFonts } from "react-native-render-html";
import { lightColors } from "../../theme";

const SYSTEM_FONTS = [...defaultSystemFonts, "Inter"];

const baseTagStyles = {
  body: {
    fontFamily: "Inter",
    fontSize: 13,
    color: lightColors.textBody,
    lineHeight: 20,
  },
  p: {
    fontFamily: "Inter",
    fontSize: 13,
    color: lightColors.textBody,
    lineHeight: 20,
    marginTop: 0,
    marginBottom: 8,
  },
  a: {
    fontFamily: "Inter",
    fontSize: 13,
    color: lightColors.textLink,
    textDecorationLine: "underline" as const,
  },
  strong: {
    fontFamily: "Inter",
    fontWeight: "700" as const,
  },
  b: {
    fontFamily: "Inter",
    fontWeight: "700" as const,
  },
  i: {
    fontFamily: "Inter",
    fontStyle: "italic" as const,
  },
  em: {
    fontFamily: "Inter",
    fontStyle: "italic" as const,
  },
  ul: {
    marginTop: 4,
    marginBottom: 8,
    paddingLeft: 16,
  },
  ol: {
    marginTop: 4,
    marginBottom: 8,
    paddingLeft: 16,
  },
  li: {
    fontFamily: "Inter",
    fontSize: 13,
    color: lightColors.textBody,
    lineHeight: 20,
    marginTop: 2,
    marginBottom: 2,
  },
  h1: {
    fontFamily: "Inter",
    fontWeight: "700" as const,
    fontSize: 20,
    color: lightColors.textTitle,
    marginTop: 12,
    marginBottom: 8,
  },
  h2: {
    fontFamily: "Inter",
    fontWeight: "700" as const,
    fontSize: 17,
    color: lightColors.textTitle,
    marginTop: 10,
    marginBottom: 6,
  },
  h3: {
    fontFamily: "Inter",
    fontWeight: "600" as const,
    fontSize: 15,
    color: lightColors.textTitle,
    marginTop: 8,
    marginBottom: 4,
  },
  br: {
    height: 16,
  },
};

interface HtmlTextProps {
  html: string;
  fontSize?: number;
  color?: string;
}

export default function HtmlText({ html, fontSize, color }: HtmlTextProps) {
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  if (!html) return null;

  const tagsStyles =
    fontSize || color
      ? {
          ...baseTagStyles,
          body: {
            ...baseTagStyles.body,
            ...(fontSize ? { fontSize } : {}),
            ...(color ? { color } : {}),
          },
          p: {
            ...baseTagStyles.p,
            ...(fontSize ? { fontSize } : {}),
            ...(color ? { color } : {}),
          },
          li: {
            ...baseTagStyles.li,
            ...(fontSize ? { fontSize } : {}),
            ...(color ? { color } : {}),
          },
        }
      : baseTagStyles;

  return (
    <RenderHtml
      contentWidth={SCREEN_WIDTH - 40}
      source={{ html }}
      systemFonts={SYSTEM_FONTS}
      tagsStyles={tagsStyles}
      baseStyle={{ fontFamily: "Inter" }}
    />
  );
}
