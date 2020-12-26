import React, { FC, KeyboardEvent } from 'react';

interface NoteEditorProps extends React.AllHTMLAttributes<HTMLTextAreaElement> {
  onEnter: () => void;
}

export const NoteEditor: FC<NoteEditorProps> = (props) => {
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    debugger;
    if (e.key == 'Enter' && !e.shiftKey) {
      e.preventDefault();
      props.onEnter();
    }
  };

  return (
    <div className="note editor">
      <textarea
        maxLength={80}
        className="note-text"
        onKeyDown={onKeyDown}
        onChange={props.onChange}
        value={props.value}
        onFocus={props.onFocus}
      />
    </div>
  );
};
