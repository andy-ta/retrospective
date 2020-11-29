export interface INote {
  id: string;
  text: string;
  user: IUser;
  currentUserVoted: boolean;
  votes: number;
}

export interface IUser {
  id: string;
  name: string;
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
  getNotesFromBoard: () => INote[];
  createDemoNote: () => string;
  createNote: (text: string) => void;
  vote: (note: INote) => void;

  on(event: 'change', listener: () => void): this;

  off(event: 'change', listener: () => void): this;
}
