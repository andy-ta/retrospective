import React, { ChangeEvent, FC, useState } from 'react';
import { IUser } from '../models/interfaces';
import { NoteEditor } from './NoteEditor';
import { Button } from './Button';
import { Username } from './Username';
import { NoteType } from '../models/note';

interface PadProps {
  createNote: (text: string, type: NoteType) => void;
  demo: () => string;
  user: IUser;
  users: IUser[];
  clear: () => void;
  setHighlightMine: (value: boolean) => void;
  highlightMine: boolean;
}

export const Pad: FC<PadProps> = (props) => {
  const [text, setText] = useState<string>('');
  const [type, setType] = useState<NoteType>(NoteType.Well);

  const createNote = () => {
    props.createNote(text, type);
    setText('');
  };
  const handleHighlight = () => {
    props.setHighlightMine(!props.highlightMine);
  };

  const onNoteTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const onNoteTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    let noteType = NoteType.Well;

    if (e.target.value === '1') {
      noteType = NoteType.NotWell;
    } else if (e.target.value === '2') {
      noteType = NoteType.Improve;
    }

    setType(noteType);
  }

  const onNoteFocus = () => {
    if (!text.length) {
      setText(props.demo());
    }
  };

  return (
    <div className="pad">
      <NoteEditor
        onFocus={onNoteFocus}
        value={text}
        onChange={onNoteTextChange}
        onEnter={createNote}
      />
      <select value={type} onChange={onNoteTypeChange}>
        <option value="0">What went well</option>
        <option value="1">What didn't go so well</option>
        <option value="2">What can we improve</option>
      </select>
      <Button onClick={createNote}>Share my note</Button>
      <Button onClick={handleHighlight}>
        {props.highlightMine ? 'Stop highlighting' : 'Highlight my notes'}
      </Button>
      <Username user={props.user} userCount={props.users.length}/>
    </div>
  );
};
