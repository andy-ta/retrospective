import { initializeIcons } from "@fluentui/react";
import { AzureClient, AzureContainerServices } from '@fluidframework/azure-client';
import { IFluidContainer } from "fluid-framework";
import React from 'react';
import ReactDOM from 'react-dom';
import "./view/index.css"
import "./view/App.css";
import { connectionConfig, containerSchema } from "./Config";
import { ThemeWrapper } from './view/ThemeWrapper';

// Helper to log with timestamps for debugging connection issues
const log = (msg: string, ...args: any[]) => {
  console.log(`[retro ${new Date().toISOString()}] ${msg}`, ...args);
};
const logError = (msg: string, ...args: any[]) => {
  console.error(`[retro ${new Date().toISOString()}] ${msg}`, ...args);
};

export async function start() {
  initializeIcons("https://res-1.cdn.office.net/files/fabric-cdn-prod_20230815.002/assets/icons/");
  log("Starting retrospective app");
  log("Connection config:", JSON.stringify(connectionConfig, null, 2));

  const getContainerId = (): { containerId: string; isNew: boolean } => {
    let isNew = false;
    if (location.hash.length === 0) {
      isNew = true;
    }
    const containerId = location.hash.substring(1);
    return { containerId, isNew };
  };

  const { containerId, isNew } = getContainerId();
  log(`Container ID: "${containerId}", isNew: ${isNew}`);

  const client = new AzureClient(connectionConfig);

  let container: IFluidContainer;
  let services: AzureContainerServices;

  const createNewContainer = async () => {
    log("Creating new container...");
    const result = await client.createContainer(containerSchema);
    container = result.container;
    services = result.services;
    log("Container created, attaching...");
    const newId = await container.attach();
    log(`Container attached, new ID: ${newId}`);
    location.hash = newId;
  };

  if (isNew) {
    await createNewContainer();
  } else {
    try {
      log(`Getting existing container: ${containerId}`);
      ({ container, services } = await client.getContainer(containerId, containerSchema));
      log("Got existing container");
    } catch (error: any) {
      logError(`Failed to load container "${containerId}": ${error?.message}`, error);
      log("Falling back to new container...");
      location.hash = "";
      await createNewContainer();
    }
  }

  log(`Container connected state: ${container!.connected}`);

  // Listen to all container events for debugging
  const containerEvents = ["connected", "disconnected", "dirty", "saved", "dispose"];
  containerEvents.forEach(evt => {
    container!.on(evt as any, () => log(`Container event: "${evt}"`));
  });

  if (!container!.connected) {
    log("Waiting for 'connected' event (30s timeout)...");
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        logError("Connection timed out after 30s. Container state:", {
          connected: container!.connected,
          disposed: container!.disposed,
        });
        reject(new Error(
          "Fluid connection timed out after 30s. " +
          "This usually means the Fluid server (tinylicious) is unreachable or rejecting WebSocket connections."
        ));
      }, 30_000);
      container!.once("connected", () => {
        clearTimeout(timeout);
        log("Container connected!");
        resolve();
      });
      container!.once("disconnected", () => {
        log("Container disconnected while waiting for connection");
      });
      container!.once("dispose", () => {
        clearTimeout(timeout);
        logError("Container was disposed while waiting for connection");
        reject(new Error("Container was disposed before connecting."));
      });
    });
  }

  log("Rendering app...");

  ReactDOM.render(
    <React.StrictMode>
      <ThemeWrapper container={container!} services={services!} />
    </React.StrictMode>,
    document.getElementById('root')
  );

  log("App rendered successfully");
}

start().catch((error) => {
  logError("Fatal error:", error);
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;height:100%;font-family:sans-serif;flex-direction:column;gap:16px;padding:20px;text-align:center">
        <h2>Failed to connect</h2>
        <p style="color:#666;max-width:600px">${error?.message || "Unknown error"}</p>
        <p style="color:#999;font-size:12px">Check browser console (F12) for detailed logs</p>
        <button onclick="location.hash='';location.reload()" style="padding:8px 16px;cursor:pointer;border-radius:4px;border:1px solid #ccc">Start new session</button>
      </div>`;
  }
});
