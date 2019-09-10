# Uniandes - Internacionalizacion MoveON API

## How to run?

### Download the needed libraries
```
npm install
```

### Compile TypeScript
To compile TypeScript to JavaScript files
```
npm run tsc
```
> Files will be compiled to JavaScript in the `/build` folder.

### Run Electron App
```
npm run app
```

## Project Structure
```
├─ api/           # Logic for MoveON API
│  ├─ api.ts      # In charge of MoveON API communication 
│  ├─ index.ts    # Integrates the API with the custom methods
│  └─ models.ts   # Models of the API
├─ view/          # Views for Electron
│   ├─ assets/    # Resources files for Electron view
│   ├─ index.html # Main view of Electron window
│   ├─ index.js   # Configuration of Electron
│   └─ app.js     # Interaction and handlers for electron
├─ build/         # Compiled TypeScript files to JavaScript
├─ node_modules/  # Needed libraries of the project
└─ settings.js    # Settings of the app for API requests

```