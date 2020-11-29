import { NoteType } from './note';

export interface INote {
  id: string;
  text: string;
  user: IUser;
  currentUserVoted: boolean;
  votes: number;
  type: NoteType;
}

export interface IUser {
  id: string;
  sessionCount: number;
}

export interface IBallot {
  id: string,
  noteId: string,
  user: IUser
}

export interface INoteDataModel {
  getUsers: () => IUser[];
  getUser: () => IUser;
  addUser: () => void;
  removeUser: () => void;
  getNotesFromBoard: () => INote[];
  createNote: (text: string, type: NoteType) => void;
  vote: (note: INote) => void;
  delete: (note: INote) => void;

  on(event: 'change', listener: () => void): this;

  off(event: 'change', listener: () => void): this;
}
