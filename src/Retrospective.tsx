import React, { FC, useEffect, useState } from 'react';
import { Board } from './partials/Board';
import { Pad } from './partials/Pad';

import './styles.scss';
import { INote, INoteDataModel, IUser } from './models/interfaces';

interface NoteroViewProps {
  readonly model: INoteDataModel;
}

interface NoteroViewState {
  user: IUser;
  users: IUser[];
  notes: INote[];
}

export const Retrospective: FC<NoteroViewProps> = (props) => {
  const generateState = () => {
    return {
      user: props.model.getUser(),
      users: props.model.getUsers(),
      notes: props.model.getNotesFromBoard(),
    };
  };
  const [state, setState] = useState<NoteroViewState>(generateState());
  const [highlightMine, setHighlightMine] = useState<boolean>();

  useEffect(() => {
    const onChange = () => setState(generateState());
    props.model.on('change', onChange);

    onChange();
    return () => {
      // When the view dismounts remove the listener to avoid memory leaks
      props.model.off('change', onChange);
    };
  }, []);

  return (
    <div className="container">
      <Board
        notes={state.notes}
        vote={props.model.vote}
        user={state.user}
        highlightMine={highlightMine}
      />
      <Pad
        createNote={props.model.createNote}
        demo={props.model.createDemoNote}
        user={state.user}
        users={state.users}
        clear={() => alert('clear not implemented')}
        setHighlightMine={setHighlightMine}
        highlightMine={highlightMine}
      />
    </div>
  );
};
