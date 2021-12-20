import { initializeIcons } from "@fluentui/react";
import { AzureClient, AzureContainerServices } from '@fluidframework/azure-client';
import { IFluidContainer } from "fluid-framework";
import React from 'react';
import ReactDOM from 'react-dom';
import "./view/index.css"
import "./view/App.css";
import { connectionConfig, containerSchema } from "./Config";
import { ThemeWrapper } from './view/ThemeWrapper';

export async function start() {
  initializeIcons();

  const getContainerId = (): { containerId: string; isNew: boolean } => {
    let isNew = false;
    if (location.hash.length === 0) {
      isNew = true;
    }
    const containerId = location.hash.substring(1);
    return { containerId, isNew };
  };

  const { containerId, isNew } = getContainerId();

  const client = new AzureClient(connectionConfig);

  let container: IFluidContainer;
  let services: AzureContainerServices;

  if (isNew) {
    ({ container, services } = await client.createContainer(containerSchema));
    const containerId = await container.attach();
    location.hash = containerId;
  } else {
    ({ container, services } = await client.getContainer(containerId, containerSchema));
  }

  if (!container.connected) {
    await new Promise<void>((resolve) => {
      container.once("connected", () => {
        resolve();
      });
    });
  }

  ReactDOM.render(
    <React.StrictMode>
      <ThemeWrapper container={container} services={services} />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

start().catch((error) => console.error(error));
