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

  const createNewContainer = async () => {
    const result = await client.createContainer(containerSchema);
    container = result.container;
    services = result.services;
    const newId = await container.attach();
    location.hash = newId;
  };

  if (isNew) {
    await createNewContainer();
  } else {
    try {
      ({ container, services } = await client.getContainer(containerId, containerSchema));
    } catch (error) {
      console.warn("Failed to load container, creating a new one:", error);
      location.hash = "";
      await createNewContainer();
    }
  }

  if (!container!.connected) {
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Fluid connection timed out after 30s"));
      }, 30_000);
      container!.once("connected", () => {
        clearTimeout(timeout);
        resolve();
      });
    });
  }

  ReactDOM.render(
    <React.StrictMode>
      <ThemeWrapper container={container!} services={services!} />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

start().catch((error) => {
  console.error(error);
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;height:100%;font-family:sans-serif;flex-direction:column;gap:16px">
        <h2>Failed to connect</h2>
        <p style="color:#666">${error?.message || "Unknown error"}</p>
        <button onclick="location.hash='';location.reload()" style="padding:8px 16px;cursor:pointer">Start new session</button>
      </div>`;
  }
});
