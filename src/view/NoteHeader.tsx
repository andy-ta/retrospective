import {
  CommandBar,
  CommandBarButton,
  ICommandBarItemProps,
  IResizeGroupProps,
  mergeStyles,
} from "@fluentui/react";
import React from "react";
import { ColorPicker } from "./ColorPicker";
import {
  getHeaderStyleForColor,
  deleteButtonStyle,
  colorButtonStyle,
  getLikesButtonStyle,
} from "./Note.style";
import { NoteProps } from "./Note"

const HeaderComponent = (props: NoteProps) => {
  const colorButtonRef = React.useRef();

  const headerProps = {
    className: mergeStyles(getHeaderStyleForColor(props.color)),
  };

  const items: ICommandBarItemProps[] = [
    {
      // @ts-ignore
      componentRef: colorButtonRef,
      key: "color",
      iconProps: {
        iconName: "Color",
      },
      subMenuProps: {
        key: "color-picker",
        items: [{ key: "foo" }],
        onRenderMenuList: () => (
          <ColorPicker
            parent={colorButtonRef}
            selectedColor={props.color!}
            setColor={(color) => props.onColorChange(color)}
          />
        ),
      },
      buttonStyles: colorButtonStyle,
    },
  ];

  const farItems: ICommandBarItemProps[] = [
    {
      key: "likes",
      onClick: props.onLike,
      text: props.numLikesCalculated.toString(),
      iconProps: {
        iconName: props.didILikeThisCalculated ? "LikeSolid" : "Like",
      },
      buttonStyles: getLikesButtonStyle(props.theme),
      commandBarButtonAs: (props) => {
        return (
          <CommandBarButton {...(props as any)} />
        );
      },
    },
    {
      key: "delete",
      iconProps: { iconName: "Clear" },
      title: "Delete Note",
      onClick: props.onDelete,
      buttonStyles: deleteButtonStyle,
    },
  ];

  const nonResizingGroup = (props: IResizeGroupProps) => (
    <div>
      <div style={{ position: "relative" }}>
        {props.onRenderData(props.data)}
      </div>
    </div>
  );

  return (
    <div {...headerProps}>
      <CommandBar
        resizeGroupAs={nonResizingGroup}
        styles={{
          root: { padding: 0, height: 36, backgroundColor: "transparent" },
        }}
        items={items}
        farItems={farItems}
      />
    </div>
  )
}

export const NoteHeader = React.memo(HeaderComponent, (prevProps, nextProps) => {
  return prevProps.color === nextProps.color
    && prevProps.numLikesCalculated === nextProps.numLikesCalculated
    && prevProps.didILikeThisCalculated === nextProps.didILikeThisCalculated
})
