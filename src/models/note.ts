import { INote, IUser } from './interfaces';

export enum NoteType {
  Well,
  NotWell,
  Improve
}

export class Note implements INote {
  public id: string;
  public text: string;
  public user: IUser;
  public votes: number;
  public currentUserVoted: boolean;
  public type: NoteType;

  constructor(note: INote, votes: number, currentUserVoted: boolean) {
    this.text = note.text;
    this.user = note.user;
    this.id = note.id;
    this.votes = votes;
    this.currentUserVoted = currentUserVoted;
    this.type = note.type;
  }
}
