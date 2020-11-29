import React, { FC } from 'react';
import { Note } from './Note';
import { INote, IUser } from '../models/interfaces';
import { NoteType } from '../models/note';

interface BoardProps {
  notes: INote[];
  vote: (note: INote) => void;
  delete: (note: INote) => void;
  user: IUser;
  highlightMine: boolean;
}

export const Board: FC<BoardProps> = (props) => {

  const renderNote = (note: INote) => {
    return (
      <Note
        key={note.id}
        note={note}
        onClick={() => props.vote(note)}
        onDelete={() => props.delete(note)}
        count={note.votes}
        user={props.user}
        highlightMine={props.highlightMine}
      />
    )
  }

  return (
    <div className="board">
      <div className="left-board">
        <h2>What went well?</h2>
        {props.notes.filter((note) => note.type === NoteType.Well).map((note) => renderNote(note))}
      </div>
      <div className="middle-board">
        <h2>What didn't go so well?</h2>
        {props.notes.filter((note) => note.type === NoteType.NotWell).map((note) => renderNote(note))}
      </div>
      <div className="right-board">
        <h2>What can we improve?</h2>
        {props.notes.filter((note) => note.type === NoteType.Improve).map((note) => renderNote(note))}
      </div>
    </div>
  );
}
