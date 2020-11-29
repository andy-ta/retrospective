import React, { FC } from 'react';
import { Note } from './Note';
import { INote, IUser } from '../models/interfaces';

interface BoardProps {
  notes: INote[];
  vote: (note: INote) => void;
  user: IUser;
  highlightMine: boolean;
}

export const Board: FC<BoardProps> = (props) => (
  <div className="board">
    {props.notes.map((note) => (
      <Note
        key={note.id}
        note={note}
        onClick={() => props.vote(note)}
        count={note.votes}
        user={props.user}
        highlightMine={props.highlightMine}
      />
    ))}
  </div>
);
