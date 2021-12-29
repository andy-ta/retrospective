import { Theme } from "@fluentui/react";
import { AzureMember } from "@fluidframework/azure-client";
import React from "react";
import { NoteData } from "../Types";
import { RetrospectiveModel } from "../RetrospectiveModel";
import { Column } from './Column';

export type NoteSpaceProps = Readonly<{
  author: AzureMember;
  model: RetrospectiveModel;
  theme: Theme
}>;

export function NoteSpace(props: NoteSpaceProps) {
  const { model } = props;
  const [notes, setNotes] = React.useState<readonly NoteData[]>([]);

  // This runs when model changes whether initiated by user or from external
  React.useEffect(() => {
    const syncLocalAndFluidState = () => {
      const noteDataArr = [];
      const ids: string[] = model.NoteIds;
      // Recreate the list of cards to re-render them via setNotes
      for (let noteId of ids) {
        const newCardData: NoteData = model.CreateNote(noteId, props.author);
        noteDataArr.push(newCardData);
      }
      setNotes(noteDataArr);
    };

    syncLocalAndFluidState();

    // Add a listener on the RetrospectiveModel listener
    // The listener will call syncLocalAndFluidState everytime there a "valueChanged" event.
    model.setChangeListener(syncLocalAndFluidState);

    return () => {
      model.removeChangeListener(syncLocalAndFluidState);
    }
  }, [model, props.author]);

  return (
    <div className="board">
      <Column author={props.author} model={props.model} notes={notes.filter(n => n.position === "left")} position="left" />
      <Column author={props.author} model={props.model} notes={notes.filter(n => n.position === "middle")} position="middle" />
      <Column author={props.author} model={props.model} notes={notes.filter(n => n.position === "right")} position="right" />
    </div>
  );
}
