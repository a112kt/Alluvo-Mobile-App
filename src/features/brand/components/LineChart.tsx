import React from "react";
import { View, useWindowDimensions } from "react-native";
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Circle,
  Text as SvgText,
} from "react-native-svg";
import { s } from "react-native-size-matters";

interface DataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  gradientColor?: string;
}

export default function LineChart({
  data,
  height = 180,
  color = "#1B2351",
  gradientColor = "#47C0D2",
}: LineChartProps) {
  const { width: screenWidth } = useWindowDimensions();
  const width = screenWidth - s(80);
  const pad = { top: 24, right: 16, bottom: 28, left: 16 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const len = data.length;

  const points = data.map((d, i) => ({
    x: pad.left + (i / Math.max(len - 1, 1)) * chartW,
    y: pad.top + chartH - (d.value / maxVal) * chartH,
    label: d.label,
  }));

  const p = (i: number) => points[i];
  const linePath =
    len < 2
      ? ""
      : points
          .slice(1)
          .reduce(
            (acc, _, i) => {
              const prev = p(i);
              const curr = p(i + 1);
              const mx = (prev.x + curr.x) / 2;
              return `${acc} C ${mx} ${prev.y}, ${mx} ${curr.y}, ${curr.x} ${curr.y}`;
            },
            `M ${p(0).x} ${p(0).y}`
          );

  const fillPath =
    !linePath || len < 2
      ? ""
      : `${linePath} L ${p(len - 1).x} ${pad.top + chartH} L ${p(0).x} ${
          pad.top + chartH
        } Z`;

  const labelStep = len <= 7 ? 1 : Math.ceil(len / 6);

  return (
    <View>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={gradientColor} stopOpacity="0.25" />
            <Stop offset="1" stopColor={gradientColor} stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {fillPath ? <Path d={fillPath} fill="url(#lg)" /> : null}
        {linePath ? (
          <Path
            d={linePath}
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ) : null}

        {points.map((pt, i) => (
          <React.Fragment key={i}>
            {i % labelStep === 0 && (
              <SvgText
                x={pt.x}
                y={height - 5}
                fontSize={10}
                fill="#A2ACB5"
                textAnchor="middle"
                fontFamily="Inter"
              >
                {pt.label}
              </SvgText>
            )}
            <Circle cx={pt.x} cy={pt.y} r={4} fill={color} />
            <Circle cx={pt.x} cy={pt.y} r={2} fill="#FFFFFF" />
          </React.Fragment>
        ))}
      </Svg>
    </View>
  );
}
