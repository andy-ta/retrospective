import { DataObject, DataObjectFactory, } from '@fluidframework/aqueduct';
import { IFluidHandle } from '@fluidframework/core-interfaces';
import { SharedMap } from '@fluidframework/map';
import { v4 as uuidv4 } from 'uuid';

import { IBallot, INote, INoteDataModel, IUser, } from '../models/interfaces';
import { Note, NoteType } from '../models/note';

export class Notero extends DataObject implements INoteDataModel {

  static readonly factory = new DataObjectFactory(
    'Notero',
    Notero,
    [
      SharedMap.getFactory(),
    ],
    {},
  );

  private notesMap: SharedMap;
  private votesMap: SharedMap;
  private usersMap: SharedMap;

  private userId: string;

  public createNote = (text: string, type: NoteType): void => {
    if (text) {
      const note: INote = {
        id: uuidv4(),
        text,
        user: this.getUser(),
        votes: 0,
        currentUserVoted: false,
        type
      };
      this.notesMap.set(note.id, note);
    }
  };

  public vote = (note: INote): void => {
    const user = this.getUser();

    const id = note.id + user.id;

    const ballot: IBallot = {
      id: id,
      noteId: note.id,
      user: user
    };

    if (this.votesMap.has(ballot.id)) {
      this.votesMap.delete(ballot.id);
    } else {
      this.votesMap.set(ballot.id, ballot);
    }
  };

  public delete = (note: INote): void => {
    const user = this.getUser();

    if (note.user.id != user.id){
      return;
    }

    if (this.notesMap.has(note.id)) {
      this.notesMap.delete(note.id);
    }
  };

  public getNotesFromBoard = (): Note[] => {

    let notes: Note[] = [];

    const votes = this.countVotes();

    this.notesMap.forEach((i: INote) => {
      let numVotes = 0;
      let voted = false;
      if (votes.has(i.id)) {
        numVotes = votes.get(i.id).count;
        voted = votes.get(i.id).voted;
      }
      notes.push(new Note(i, numVotes, voted));
    });
    return notes;
  };

  public addUser = (): void => {
    // Check if the user has a session.
    if (sessionStorage.getItem('userId') &&
      this.usersMap.get<IUser>(sessionStorage.getItem('userId'))) {
      this.userId = sessionStorage.getItem('userId');
      const user = this.usersMap.get<IUser>(this.userId);
      user.sessionCount++;
      this.usersMap.set(user.id, user);
    } else {
      const user: IUser = {
        id: uuidv4(),
        sessionCount: 1
      };
      this.userId = user.id;
      sessionStorage.setItem('userId', user.id);
      this.usersMap.set(user.id, user);
    }
  };

  public removeUser = (): void => {
    const user = this.usersMap.get<IUser>(this.userId);
    // Is the user's last session?
    if (user.sessionCount <= 1) {
      this.usersMap.delete(this.userId);
    } else {
      user.sessionCount--;
      this.usersMap.set(this.userId, user);
    }
  }

  public getUser = (): IUser => {
    return this.usersMap.get<IUser>(this.userId);
  };

  public getUsers(): IUser[] {
    const users: IUser[] = [];
    this.usersMap.forEach((i: IUser) => {
      users.push(i);
    });
    return users;
  }

  protected async initializingFirstTime() {
    this.createSharedMap('notes');
    this.createSharedMap('votes');
    this.createSharedMap('users');
  }

  protected async hasInitialized() {
    this.notesMap = await this.root.get<IFluidHandle<SharedMap>>('notes').get();
    this.votesMap = await this.root.get<IFluidHandle<SharedMap>>('votes').get();
    this.usersMap = await this.root.get<IFluidHandle<SharedMap>>('users').get();

    this.addUser();

    this.createEventListeners(this.notesMap);
    this.createEventListeners(this.votesMap);
    this.createEventListeners(this.usersMap);
  }

  private createSharedMap(id: string): void {
    const map = SharedMap.create(this.runtime);
    this.root.set(id, map.handle);
  }

  private createEventListeners(sharedMap: SharedMap): void {
    sharedMap.on('valueChanged', () => {
      this.emit('change');
    });

    sharedMap.on('clear', () => {
      this.emit('change');
    });

    const quorum = this.context.getQuorum();
    quorum.on('addMember', () => {
      this.emit('change');
    });

    quorum.on('removeMember', () => {
      this.emit('change');
    });
  }

  private countVotes(): Map<string, { count: number, voted: boolean }> {
    let voteCounts = new Map();

    const user = this.getUser();

    this.votesMap.forEach((i: IBallot) => {
      if (voteCounts.has(i.noteId)) {
        voteCounts.set(
          i.noteId,
          {
            count: voteCounts.get(i.noteId).count + 1,
            voted: (i.user.id == user.id) || voteCounts.get(i.noteId).voted
          });
      } else {
        voteCounts.set(
          i.noteId,
          {
            count: 1,
            voted: (i.user.id == user.id)
          });
      }
    });
    return voteCounts;
  }
}
