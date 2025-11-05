import * as React from "react";
import { getProgressPoint } from "../../../helpers/bar-helper";
import { BarDisplay } from "./bar-display";
import { BarDateHandle } from "./bar-date-handle";
import { BarProgressHandle } from "./bar-progress-handle";
import { TaskItemProps } from "../task-item";
import { BarBaseline } from "./bar-baseline";
import styles from "./bar.module.css";

export interface BarProps extends TaskItemProps {
  baselineView?: "planned" | "actual";
}

export const Bar: React.FC<BarProps> = ({
  task,
  isProgressChangeable,
  isDateChangeable,
  rtl,
  onEventStart,
  isSelected,
  baselineView,
}: BarProps) => {
  const progressPoint = getProgressPoint(
    +!rtl * task.progressWidth + task.progressX,
    task.y,
    task.height
  );
  const handleHeight = task.height - 2;

  // Baseline logic: always show the opposite of the main bar
  let baselineStart: Date | undefined;
  let baselineEnd: Date | undefined;
  if (baselineView === "planned") {
    baselineStart = task.actualStart;
    baselineEnd = task.actualEnd;
  } else if (baselineView === "actual") {
    baselineStart = task.plannedStart;
    baselineEnd = task.plannedEnd;
  }

  // Calculate baseline bar position (reuse main bar logic if possible)
  let baselineX1: number | undefined = undefined;
  let baselineX2: number | undefined = undefined;
  if (
    baselineStart &&
    baselineEnd &&
    typeof task.x1 === "number" &&
    typeof task.x2 === "number" &&
    task.start &&
    task.end
  ) {
    const mainDuration =
      (task.end as unknown as number) - (task.start as unknown as number);
    const mainWidth = task.x2 - task.x1;
    const scale = mainDuration !== 0 ? mainWidth / mainDuration : 0;
    baselineX1 =
      task.x1 +
      ((baselineStart as unknown as number) -
        (task.start as unknown as number)) *
        scale;
    baselineX2 =
      task.x1 +
      ((baselineEnd as unknown as number) - (task.start as unknown as number)) *
        scale;
    if (
      typeof baselineX1 === "number" &&
      typeof baselineX2 === "number" &&
      baselineX2 < baselineX1
    ) {
      [baselineX1, baselineX2] = [baselineX2, baselineX1];
    }
    // Ensure minimum width for baseline bar
    if (baselineX1 === baselineX2) {
      baselineX2 = baselineX1 + 2; // minimum 2px width
    }
  }

  return (
    <g className={styles.barWrapper} tabIndex={0}>
      {/* Baseline bar below main bar, always rendered first */}
      {baselineX1 !== undefined && baselineX2 !== undefined && (
        <BarBaseline
          x={baselineX1}
          y={task.y + task.height + 2}
          width={baselineX2 - baselineX1}
          height={4}
          color="red"
        />
      )}
      {/* Main bar */}
      <BarDisplay
        x={task.x1}
        y={task.y}
        width={task.x2 - task.x1}
        height={task.height}
        progressX={task.progressX}
        progressWidth={task.progressWidth}
        barCornerRadius={task.barCornerRadius}
        styles={task.styles}
        isSelected={isSelected}
        onMouseDown={(e: React.MouseEvent<SVGGElement, MouseEvent>) => {
          isDateChangeable && onEventStart("move", task, e);
        }}
      />
      <g className="handleGroup">
        {isDateChangeable && (
          <g>
            {/* left */}
            <BarDateHandle
              x={task.x1 + 1}
              y={task.y + 1}
              width={task.handleWidth}
              height={handleHeight}
              barCornerRadius={task.barCornerRadius}
              onMouseDown={(e: React.MouseEvent<SVGGElement, MouseEvent>) => {
                onEventStart("start", task, e);
              }}
            />
            {/* right */}
            <BarDateHandle
              x={task.x2 - task.handleWidth - 1}
              y={task.y + 1}
              width={task.handleWidth}
              height={handleHeight}
              barCornerRadius={task.barCornerRadius}
              onMouseDown={(e: React.MouseEvent<SVGGElement, MouseEvent>) => {
                onEventStart("end", task, e);
              }}
            />
          </g>
        )}
        {isProgressChangeable && (
          <BarProgressHandle
            progressPoint={progressPoint}
            onMouseDown={(e: React.MouseEvent<SVGGElement, MouseEvent>) => {
              onEventStart("progress", task, e);
            }}
          />
        )}
      </g>
    </g>
  );
};
