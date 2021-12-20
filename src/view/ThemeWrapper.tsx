import { IFluidContainer } from 'fluid-framework';
import { AzureContainerServices } from '@fluidframework/azure-client';
import { ThemeProvider } from '@fluentui/react';
import React, { useState } from 'react';
import { DefaultTheme } from './Themes';
import { RetrospectiveView } from './RetrospectiveView';

export type ThemeWrapperProps = Readonly<{
  container: IFluidContainer,
  services: AzureContainerServices
}>;

export const ThemeWrapper = (props: ThemeWrapperProps) => {
  const [theme, setTheme] = useState(DefaultTheme);
  return (
    <ThemeProvider theme={theme}>
      <RetrospectiveView container={props.container} services={props.services} setTheme={setTheme} theme={theme} />
    </ThemeProvider>
  )
}
