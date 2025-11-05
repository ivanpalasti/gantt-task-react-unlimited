import * as React from "react";

export interface BarBaselineProps {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export const BarBaseline: React.FC<
  BarBaselineProps & React.SVGProps<SVGRectElement>
> = ({ x, y, width, height, color, ...rest }) => (
  <rect
    x={x}
    y={y}
    width={width}
    height={height}
    fill={color}
    opacity={0.5}
    stroke={color}
    strokeDasharray="4,2"
    rx={2}
    ry={2}
    {...rest}
  />
);
