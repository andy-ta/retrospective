import React from 'react';
import ReactDOM from 'react-dom';

import { getTinyliciousContainer, Notero } from './fluid';
import { Retrospective } from './Retrospective';
import { ContainerRuntimeFactoryWithDefaultDataStore, getDefaultObjectFromContainer } from '@fluidframework/aqueduct';

let createNew = false;
if (window.location.hash.length === 0) {
  createNew = true;
  window.location.hash = Date.now().toString();
}
const documentId = window.location.hash.substring(1);

async function start() {
  const factory = new ContainerRuntimeFactoryWithDefaultDataStore(
    Notero.factory,
    new Map([Notero.factory.registryEntry])
  );

  const container = await getTinyliciousContainer(documentId, factory, createNew);

  const defaultObject = await getDefaultObjectFromContainer<Notero>(container);

  ReactDOM.render(
    <Retrospective model={defaultObject}/>,
    document.getElementById('content'));
}

start().catch((e) => {
  console.error(e);
  console.log(
    '%cEnsure you are running the Tinylicious Fluid Server\nUse:`npm run start:server`',
    'font-size:30px');
});
