import { IStyle, mergeStyles, Text, Theme, ThemeProvider } from "@fluentui/react";
import { AzureMember } from "@fluidframework/azure-client";
import React from "react";
import { useDrop } from 'react-dnd';
import { NoteData, Position } from "../Types";
import { Note } from "./Note";
import { RetrospectiveModel } from "../RetrospectiveModel";
import { lightTheme } from './Themes';

export type NoteSpaceProps = Readonly<{
  author: AzureMember;
  model: RetrospectiveModel;
  theme: Theme
}>;

export function NoteSpace(props: NoteSpaceProps) {
  const { model } = props;
  const [notes, setNotes] = React.useState<readonly NoteData[]>([]);

  // This runs when model changes whether initiated by user or from external
  React.useEffect(() => {
    const syncLocalAndFluidState = () => {
      const noteDataArr = [];
      const ids: string[] = model.NoteIds;
      // Recreate the list of cards to re-render them via setNotes
      for (let noteId of ids) {
        const newCardData: NoteData = model.CreateNote(noteId, props.author);
        noteDataArr.push(newCardData);
      }
      setNotes(noteDataArr);
    };

    syncLocalAndFluidState();

    // Add a listener on the RetrospectiveModel listener
    // The listener will call syncLocalAndFluidState everytime there a "valueChanged" event.
    model.setChangeListener(syncLocalAndFluidState);

    return () => {
      model.removeChangeListener(syncLocalAndFluidState);
    }
  }, [model, props.author]);

  const rootStyle: IStyle = {
    borderRadius: "2px",
    display: "flex",
    height: "100vh",
    margin: "10px",
    position: "relative"
  };
  const spaceClass = mergeStyles(rootStyle);

  const [, drop] = useDrop(() => ({
    accept: 'note',
    drop(item: any, monitor) {
      const delta = monitor.getDifferenceFromInitialOffset()!;
      const left = Math.round(item.left + delta.x);
      const top = Math.round(item.top + delta.y);
      model.MoveNote(item.id, {
        x: left > 0 ? left : 0,
        y: top > 0 ? top : 0
      })
      return undefined;
    },
  }), [model]);

  return (
    <div className={spaceClass}>
      <div className="leftBoard">
        <Text variant="xLarge">What went well?</Text>
      </div>
      <div className="middleBoard">
        <Text variant="xLarge">What went wrong?</Text>
      </div>
      <div className="rightBoard">
        <Text variant="xLarge">What can we improve?</Text>
      </div>
      <ThemeProvider theme={lightTheme} id="NoteSpace" ref={drop}>
        {notes.map((note, i) => {
          const setPosition = (position: Position) => {
            model.MoveNote(note.id, position);
          };

          const setText = (text: string) => {
            model.SetNoteText(note.id, text, props.author.userId, props.author.userName, Date.now());
          };

          const onLike = () => {
            model.LikeNote(note.id, props.author);
          };

          const getLikedUsers = () => {
            return model.GetNoteLikedUsers(note.id);
          };

          const onDelete = () => {
            model.DeleteNote(note.id);
          };

          const onColorChange = (color: string) => {
            model.SetNoteColor(note.id, color);
          };

          return (
            <Note
              {...note}
              id={note.id}
              currentUser={props.author}
              lastEdited={note.lastEdited}
              author={note.author}
              key={note.id}
              text={note.text}
              setPosition={setPosition}
              onLike={onLike}
              getLikedUsers={getLikedUsers}
              onDelete={onDelete}
              onColorChange={onColorChange}
              setText={setText}
            />
          );
          })}
      </ThemeProvider>
    </div>
  );
}
