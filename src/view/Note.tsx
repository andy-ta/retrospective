import { mergeStyles, Theme, } from '@fluentui/react';
import { AzureMember } from '@fluidframework/azure-client';
import React from 'react';
import { useDrag } from 'react-dnd';
import { DefaultColor } from './Color';
import { getRootStyleForColor } from './Note.style';
import { NoteData, Position } from '../Types';
import { NoteHeader } from './NoteHeader';
import { NoteBody } from './NoteBody';
import { NoteFooter } from './NoteFooter';

export type NoteProps = Readonly<{
  id: string;
  currentUser: AzureMember;
  theme: Theme;
  setPosition: (position: Position) => void;
  onLike: () => void;
  getLikedUsers: () => AzureMember[];
  onDelete: () => void;
  onColorChange: (color: string) => void;
  setText: (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}> &
  Pick<
    NoteData,
    | "author"
    | "lastEdited"
    | "position"
    | "color"
    | "didILikeThisCalculated"
    | "numLikesCalculated"
    | "text"
  >;

export function Note(props: NoteProps) {
  const {
    id,
    position,
    color = DefaultColor,
    setText,
    text
  } = props;

  const [, drag] = useDrag(
    () => ({
      type: "note",
      item: { id, position },
    }),
    [id, position]
  );

  const rootClass = mergeStyles(getRootStyleForColor(color, props.theme));

  // hash the id then use it as a seed to pick a random rotation
  const getRotation = (noteId: string): string => {
    const choices = ["rotate(0deg)", "rotate(2deg)", "rotate(3deg)", "rotate(-2deg)", "rotate(-3deg)"];
    let hash = 0, i, chr;
    if (noteId.length === 0) return choices[0];
    for (i = 0; i < noteId.length; i++) {
      chr   = noteId.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    // mulberry32
    let t = hash + 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    const random = ((t ^ t >>> 14) >>> 0) / 4294967296;
    return choices[Math.floor(random * choices.length)];
  }

  const styles = {
    transform: getRotation(id)
  }

  return (
    <div className={rootClass} ref={drag} style={styles}>
      <NoteHeader {...props} />
      <NoteBody setText={setText} text={text} color={color} theme={props.theme} />
      <NoteFooter />
    </div>
  );
}




