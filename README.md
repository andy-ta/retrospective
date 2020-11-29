# Retrospective

Retrospective is an application for sprint retrospective collaborative sticky notes.

It is based of an example by Microsoft on using the Fluid Framework to build a collaborative 
line of business application. You can find the example
[here](https://github.com/microsoft/FluidExamples/tree/main/brainstorm).

## Getting Started

To run this follow the steps below:

1. Run `yarn install` from the brainstorm folder root
2. Run `yarn start` to start both the client and server
3. Navigate to `http://localhost:8080` in a browser tab

## Available Scripts

### `build`

```bash
yarn build
```

Runs [`tsc`](###-tsc) and [`webpack`](###-webpack) and outputs the results in `./dist`.

### `start`

```bash
yarn start
```

Runs both [`start:client`](###-start:client) and [`start:server`](###-start:server).

### `start:client`

```bash
yarn start:all
```

Uses `webpack-dev-server` to start a local webserver that will host your webpack file.

Once you run `start` you can navigate to `http://localhost:8080` in any browser window to use your fluid example.

> The Tinylicious Fluid server must be running. See [`start:server`](###-start:server) below.

### `start:server`

```bash
yarn start:server
```

Starts an instance of the Tinylicious Fluid server running locally at `http://localhost:3000`.

> Tinylicious only needs to be running once on a machine and can support multiple examples.

### `tsc`

Compiles the TypeScript code. Output is written to the `./dist` folder.

### `webpack`

Compiles and webpacks the TypeScript code. Output is written to the `./dist` folder.

## License

Initially [licensed](https://github.com/microsoft/FluidExamples/blob/main/LICENSE)
under by Microsoft Corporation.
