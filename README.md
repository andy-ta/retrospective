# Retrospective

Retrospective is an application for doing sprint retrospective collaborative sticky notes virtually.

It is based off of [Brainstorm](https://github.com/microsoft/FluidExamples/tree/main/brainstorm) by Microsoft 
as an example on using the Fluid Framework to build a collaborative line of business application.

## Usage

Head over to https://retrospective.andyta.me, then copy and paste the generated browser url to your Agile team.

## Development
### Getting Started

Follow the steps below to run this in local mode (Azure local service):

1. Run `npm install` from the folder root
2. Run `npx @fluidframework/azure-local-service@latest` to start the Azure local service for testing and development
3. Run `npm run start` to start the client
4. Navigate to `http://localhost:3000` in a browser tab

Follow the steps below to run this in remote mode (Routerlicious):

1. Run `npm install` from the folder root
2. Run `npm run start:azure` to connect to the Azure Fluid Relay service
3. Navigate to `http://localhost:3000` in a browser tab

### Using Retrospective

1. Navigate to `http://localhost:3000`

You'll be taken to a url similar to `http://localhost:3000/**#1621961220840**` the path `#1621961220840` specifies one retrospective session.

2. Navigate to the same url in another window or tab

Now you can create notes, write text, change colors and more!

## License

Initially [licensed](https://github.com/microsoft/FluidExamples/blob/main/LICENSE)
under by Microsoft Corporation.
