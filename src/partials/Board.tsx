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
    <div className="left-board">
      <h2>What went well?</h2>
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
    <div className="middle-board">
      <h2>What didn't go so well?</h2>
    </div>
    <div className="right-board">
      <h2>What can we improve?</h2>
    </div>
  </div>
);
