import { mergeStyles, Spinner, Theme } from "@fluentui/react";
import { AzureContainerServices } from "@fluidframework/azure-client";
import { IFluidContainer } from "fluid-framework";
import * as React from "react";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { RetrospectiveModel, createRetrospectiveModel } from "../RetrospectiveModel";
import { Header } from "./Header";
import { NoteSpace } from "./NoteSpace";

export type RetrospectiveViewProps = Readonly<{
  container: IFluidContainer,
  services: AzureContainerServices,
  setTheme: (theme: Theme) => void,
  theme: Theme
}>;

export const RetrospectiveView = (props: RetrospectiveViewProps) => {
  const { container, services } = props;
  const [model] = React.useState<RetrospectiveModel>(createRetrospectiveModel(container));

  const audience = services.audience;
  // retrieve all the members currently in the session
  const [members, setMembers] = React.useState(Array.from(audience.getMembers().values()));
  // set the user as the author so the user can be assigned as the author when needed
  const authorInfo = audience.getMyself();
  const setTheme = props.setTheme;
  const setMembersCallback = React.useCallback(() => setMembers(
    Array.from(
      audience.getMembers().values()
    )
  ), [setMembers, audience]);
  // Setup a listener to update our users when new clients join the session
  React.useEffect(() => {
    container.on("connected", setMembersCallback);
    audience.on("membersChanged", setMembersCallback);
    return () => {
      container.off("connected", () => setMembersCallback);
      audience.off("membersChanged", () => setMembersCallback);
    };
  }, [container, audience, setMembersCallback]);

  const wrapperClass = mergeStyles({
    height: "100%",
    display: "flex",
    flexDirection: "column",
  });

  if (authorInfo === undefined) {
    return <Spinner />;
  }

  return (
    <div className={wrapperClass}>
      <Header
        model={model}
        author={authorInfo}
        members={members}
        setTheme={setTheme}
      />
      <DndProvider backend={HTML5Backend}>
        <NoteSpace
          model={model}
          author={authorInfo}
          theme={props.theme}
        />
      </DndProvider>
    </div>
  );
};
