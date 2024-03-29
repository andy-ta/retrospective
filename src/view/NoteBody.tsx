import React from 'react';
import { TextField, Theme } from '@fluentui/react';
import { NoteData } from '../Types';
import { ColorOptions, DefaultColor } from './Color';

export type NoteBodyProps = Readonly<{
  theme: Theme
  setText(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>): void;
}> &
  Pick<NoteData, "text" | "color">;

export function NoteBody(props: NoteBodyProps) {
  const { setText, text, color = DefaultColor } = props;

  return (
    <div style={{ flex: 1 }}>
      <TextField
        styles={{ fieldGroup: { background: ColorOptions[color][props.theme.isInverted ? "dark" : "light"] } }}
        borderless
        multiline
        resizable={false}
        autoAdjustHeight
        onChange={(event) => setText(event)}
        value={text}
        placeholder={"Enter Text Here"}
      />
    </div>
  );
}
