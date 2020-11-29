import { INote, IUser } from './interfaces';

export class Note implements INote {

  public id: string;
  public text: string;
  public user: IUser;
  public votes: number;
  public currentUserVoted: boolean;

  constructor(note: INote, votes: number, currentUserVoted: boolean) {
    this.text = note.text;
    this.user = note.user;
    this.id = note.id;
    this.votes = votes;
    this.currentUserVoted = currentUserVoted;
  }
}
