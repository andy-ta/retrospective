import { Text, Theme } from '@fluentui/react';
import { NoteData, Position } from '../Types';
import { Note } from './Note';
import React from 'react';
import { AzureMember } from '@fluidframework/azure-client';
import { RetrospectiveModel } from '../RetrospectiveModel';
import { useDrop } from 'react-dnd';

export type ColumnProps = Readonly<{
  author: AzureMember,
  model: RetrospectiveModel,
  notes: Readonly<NoteData[]>,
  position: Position,
  theme: Theme
}>;

export function Column(props: ColumnProps) {
  const [, drop] = useDrop(() => ({
    accept: 'note',
    drop(item: any) {
      props.model.MoveNote(item.id, props.position);
      return undefined;
    },
  }), [props.model]);

  const getClass = () => {
    return props.position + "Column column";
  }

  const getTitle = () => {
    let title = 'N/A';
    switch (props.position) {
      case "left":
        title = "What went well?";
        break;
      case "middle":
        title = "What didn't go so well?";
        break;
      case "right":
        title = "What can we improve?";
        break;
      default:
        break;
    }
    return title;
  }

  return (
    <div className={getClass()} ref={drop}>
      <Text variant="xLarge">{getTitle()}</Text>
        <div className="noteSpace">
          {props.notes.map(note => {
            const setPosition = (position: Position) => {
              props.model.MoveNote(note.id, position);
            };

            const setText = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              const maxNoteBodyHeight = 182;
              const currentText = note.text;
              const newText = event.currentTarget.value;
              // Prevent note from expanding vertically (is the text at the max height yet?), but allow deleting text.
              if (event.currentTarget.offsetHeight < maxNoteBodyHeight || (currentText && (newText.length < currentText.length))) {
                console.log(event.currentTarget.offsetHeight);
                props.model.SetNoteText(note.id, event.currentTarget.value, props.author.userId, props.author.userName, Date.now());
              }
            };

            const onLike = () => {
              props.model.LikeNote(note.id, props.author);
            };

            const getLikedUsers = () => {
              return props.model.GetNoteLikedUsers(note.id);
            };

            const onDelete = () => {
              props.model.DeleteNote(note.id);
            };

            const onColorChange = (color: string) => {
              props.model.SetNoteColor(note.id, color);
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
                theme={props.theme}
                setPosition={setPosition}
                onLike={onLike}
                getLikedUsers={getLikedUsers}
                onDelete={onDelete}
                onColorChange={onColorChange}
                setText={setText}
              />
            );
          })}
        </div>
    </div>
  );
}
