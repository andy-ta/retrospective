import {
  Text,
  CommandBar,
  ICommandBarItemProps, Theme, Link,
} from "@fluentui/react";
import { AzureMember } from "@fluidframework/azure-client";
import React from "react";
import { RetrospectiveModel } from "../RetrospectiveModel";
import { DefaultColor } from "./Color";
import { ColorPicker } from "./ColorPicker";
import { NoteData } from "../Types";
import { NOTE_SIZE } from "./Note.style";
import { ThemeName, themeNameToTheme } from './Themes';

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
export interface HeaderProps {
  model: RetrospectiveModel;
  author: AzureMember;
  members: AzureMember[];
  setTheme: (theme: Theme) => void
}

export function Header(props: HeaderProps) {
  const colorButtonRef = React.useRef<any>();
  const [color, setColor] = React.useState(DefaultColor);
  const setTheme = props.setTheme;

  // add in all the default attributes needed for a new note, including setting the last edited author as the
  // user (since user created the note).
  const onAddNote = () => {
    const { scrollHeight, scrollWidth } = document.getElementById("NoteSpace")!;
    const id = uuidv4();
    const newCardData: NoteData = {
      id,
      position: {
        x: Math.floor(Math.random() * (scrollWidth - NOTE_SIZE.width)),
        y: Math.floor(Math.random() * (scrollHeight - NOTE_SIZE.height)),
      },
      lastEdited: { userId: props.author.userId, userName: props.author.userName, time: Date.now() },
      author: props.author,
      numLikesCalculated: 0,
      didILikeThisCalculated: false,
      color
    };
    props.model.SetNote(id, newCardData);
  };

  const onSetTheme = (theme: ThemeName) => {
    setTheme(themeNameToTheme(theme));
  }

  const items: ICommandBarItemProps[] = [
    {
      key: "title",
      onRender: () => (
        <Text
          variant="xLarge"
          styles={{
            root: { alignSelf: "center", marginBottom: 6, marginRight: 16 },
          }}
        >
          Retrospective
        </Text>
      ),
    },
    {
      key: "add",
      text: "Add note",
      iconProps: {
        iconName: "QuickNote",
      },
      subMenuProps: {
        items: [
          { key: "whatwentwell", text: "What went well", onClick: onAddNote },
          { key: "whatdidntgosowell", text: "What didn't go so well", onClick: onAddNote },
          { key: "whatcanweimprove", text: "What can we improve", onClick: onAddNote },
        ],
      }
    },
    {
      componentRef: colorButtonRef,
      key: "color",
      text: "Default Color",
      iconProps: {
        iconName: "Color",
      },
      subMenuProps: {
        key: "color-picker",
        items: [{ key: "foo" }],
        onRenderMenuList: () => (
          <ColorPicker
            parent={colorButtonRef}
            selectedColor={color}
            setColor={setColor}
          />
        ),
      },
    },
    {
      key: "theme",
      text: "Theme",
      iconProps: {
        iconName: "Sunny",
      },
      subMenuProps: {
        items: [
          { key: "lighttheme", text: "Light Theme", onClick: () => onSetTheme("default")},
          { key: "darktheme", text: "Dark Theme", onClick: () => onSetTheme("dark")},
        ],
      }
    },
  ];

  const farItems: ICommandBarItemProps[] = [
    {
      key: "presence",
      onRender: () => (
        <Text
          styles={{
            root: { alignSelf: "center", marginRight: 16 },
          }}
        >
          With <strong>{ props.members.length - 1 }</strong> other { props.members.length - 1 === 1 ? 'person' : 'people' }
        </Text>
      ),
    },
    {
      key: 'ko-fi',
      onRender: () => (
        <Link
          href="https://ko-fi.com/A0A87FYC1"
          target='_blank'
          styles={{
            root: { alignSelf: "center", marginRight: 16 },
          }}>
          Buy Me a Coffee
        </Link>
      )
    }
  ];
  return (
    <CommandBar
      styles={{ root: { padding: '5px' } }}
      items={items}
      farItems={farItems}
    />
  );
}
