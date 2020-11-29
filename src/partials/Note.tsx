import React, { FC, MouseEventHandler } from 'react';
import { INote, IUser } from '../models/interfaces';

interface NoteProps extends React.AllHTMLAttributes<HTMLButtonElement> {
  count: number;
  note: INote;
  user: IUser;
  highlightMine: boolean;
  onDelete?: MouseEventHandler<HTMLSpanElement>;
}

export const Note: FC<NoteProps> = (props) => {
  let isUserNote = props.note.user.id == props.user.id;

  let noteClassName = 'note';

  if(props.highlightMine && !isUserNote) {
    noteClassName = 'note others'
  }

  return (
    <button
      className={noteClassName}
      onClick={props.onClick}>
      {isUserNote && (
        <span
          className='note-icon-delete'
          onClick={(evt) => {evt.stopPropagation(); props.onDelete(evt);}}>
          X
        </span>
      )}
      {props.count > 0 && (
        <span
          className={`note-badge ${props.note.currentUserVoted ? 'voted' : ''}`}>
          {props.count}
        </span>
      )}
      <span className="note-text">{props.note.text}</span>
    </button>
  );
}
