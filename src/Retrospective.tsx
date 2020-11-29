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
  const loader = document.querySelector('#loader-container');
  const hideLoader = () => loader.remove();

  const generateState = () => {
    return {
      user: props.model.getUser(),
      users: props.model.getUsers(),
      notes: props.model.getNotesFromBoard(),
    };
  };
  const removeUser = () => {
    props.model.removeUser();
  }
  const [state, setState] = useState<NoteroViewState>(generateState());
  const [highlightMine, setHighlightMine] = useState<boolean>();

  useEffect(() => {
    const onChange = () => setState(generateState());
    props.model.on('change', onChange);

    // Clean up the user's session.
    window.addEventListener("beforeunload", (e) => {
      e.preventDefault();
      return removeUser();
    });

    onChange();
    hideLoader();

    return () => {
      props.model.off('change', onChange);
    };
  }, []);

  return (
    <div className="container">
      <Board
        notes={state.notes}
        vote={props.model.vote}
        delete={props.model.delete}
        user={state.user}
        highlightMine={highlightMine}
      />
      <Pad
        createNote={props.model.createNote}
        user={state.user}
        users={state.users}
        clear={() => alert('clear not implemented')}
        setHighlightMine={setHighlightMine}
        highlightMine={highlightMine}
      />
    </div>
  );
};
