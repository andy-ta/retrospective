import React, { ChangeEvent, FC, useState } from 'react';
import { IUser } from '../models/interfaces';
import { NoteEditor } from './NoteEditor';
import { Button } from './Button';
import { Username } from './Username';

interface PadProps {
  createNote: (text: string) => void;
  demo: () => string;
  user: IUser;
  users: IUser[];
  clear: () => void;
  setHighlightMine: (value: boolean) => void;
  highlightMine: boolean;
}

export const Pad: FC<PadProps> = (props) => {
  const [value, setValue] = useState<string>('');

  const createNote = () => {
    props.createNote(value);
    setValue('');
  };
  const handleHighlight = () => {
    props.setHighlightMine(!props.highlightMine);
  };

  const onNoteValueChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const onNoteFocus = () => {
    if (!value.length) {
      setValue(props.demo());
    }
  };

  return (
    <div className="container">
      <div className="pad">
        <NoteEditor
          onFocus={onNoteFocus}
          value={value}
          onChange={onNoteValueChange}
          onEnter={createNote}
        />
        <Button onClick={createNote}> Share my note </Button>
        <Button onClick={handleHighlight}>
          {props.highlightMine ? 'Stop highlighting' : 'Highlight my notes'}
        </Button>
        {/* <Button onClick={props.clear}> Tidy up </Button> */}
        <Username user={props.user} userCount={props.users.length}/>
      </div>
    </div>
  );
};
