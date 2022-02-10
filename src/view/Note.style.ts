import { IRawStyle, IStyle, ITooltipHostStyles, IButtonStyles, Theme } from '@fluentui/react';
import { ColorOptions } from "./Color";
import { ColorId } from "../Types";

export const NOTE_SIZE = {
  width: 225,
  height: 225
}

export const tooltipHostStyle: Partial<ITooltipHostStyles> = {
  root: { display: "inline-block" },
};

export const iconStyle: React.CSSProperties = {
  color: "black",
  fontSize: "10px",
};

export const deleteButtonStyle: IButtonStyles = {
  root: { backgroundColor: "transparent" },
  rootHovered: { backgroundColor: "transparent" },
  rootPressed: { backgroundColor: "transparent" },
  icon: { fontSize: "13px" },
  iconHovered: { fontSize: "15px" }
};

export const colorButtonStyle: IButtonStyles = {
  root: { backgroundColor: "transparent " },
  rootHovered: { backgroundColor: "transparent" },
  rootPressed: { backgroundColor: "transparent" },
  rootExpanded: { backgroundColor: "transparent" },
  rootExpandedHovered: { backgroundColor: "transparent" },
  iconHovered: { fontSize: "18px" },
  iconExpanded: { fontSize: "18px" }
};

export function getLikesButtonStyle(theme: Theme) {
  return {
    root: { backgroundColor: "transparent", color: theme.palette.themeDark },
    rootHovered: { backgroundColor: "transparent", fontSize: "18px", color: theme.palette.themeDark },
    rootPressed: { backgroundColor: "transparent", color: theme.palette.themeDark },
    iconHovered: { fontSize: "18px" }
  };
}

export function getRootStyleForColor(color: ColorId, theme: Theme): IStyle {
  return {
    background: ColorOptions[color][theme.isInverted ? "dark" : "light"],
    borderRadius: "2px",
    boxShadow:
      "rgb(0 0 0 / 13%) 0px 1.6px 3.6px 0px, rgb(0 0 0 / 11%) 0px 0.3px 0.9px 0px",
    flexShrink: 0,
    display: "inline-block",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    minHeight: NOTE_SIZE.height,
    minWidth: NOTE_SIZE.width
  };
}

export function getHeaderStyleForColor(color: ColorId): IRawStyle {
  if (color === undefined) {
    return { backgroundColor: ColorOptions["Blue"].dark };
  }
  return { backgroundColor: ColorOptions[color].dark };
}
