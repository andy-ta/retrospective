import { AzureClientProps, LOCAL_MODE_TENANT_ID } from "@fluidframework/azure-client";
import { SharedMap } from "fluid-framework";
import { getRandomName } from "@fluidframework/server-services-client";
import { v4 as uuid } from 'uuid';
import { InsecureTokenProvider } from "@fluidframework/test-client-utils";

// Runtime config injected by config.js (written at container startup)
const runtimeConfig = (window as any).__CONFIG__ || {};

export const useAzure = process.env.REACT_APP_FLUID_CLIENT === "azure";
export const key: string = process.env.REACT_APP_FLUID_KEY as string;

const fluidOrderer: string = runtimeConfig.FLUID_ORDERER || "http://localhost:7070";
const fluidStorage: string = runtimeConfig.FLUID_STORAGE || "http://localhost:7070";

export const containerSchema = {
  initialObjects: {
    map: SharedMap,
  },
}

export const userConfig = {
  id: uuid(),
  name: getRandomName(),
};

export const connectionConfig: AzureClientProps = useAzure ? { connection: {
    tenantId: "c1768930-cfef-4b98-8c97-6c1c1cd76646",
    tokenProvider: new InsecureTokenProvider(key, userConfig),
    orderer: "https://alfred.westus2.fluidrelay.azure.com",
    storage: "https://historian.westus2.fluidrelay.azure.com",
  }} : { connection: {
    tenantId: LOCAL_MODE_TENANT_ID,
    tokenProvider: new InsecureTokenProvider("fooBar", userConfig),
    orderer: fluidOrderer,
    storage: fluidStorage,
  }} ;
