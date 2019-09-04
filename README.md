# Uniandes - Internacionalizacion MoveON API

## How to run?

### Compile TypeScript
* To compile TypeScript to JavaScript files  
  ```
  npm run tsc
  ```
  Files will be compiled to JavaScript in the `build` folder.

* To run the app  
  ```
  npm run app
  ```

## Structure
```
├─ app/
│  ├─ api.ts      # In charge of MoveON API communication 
│  ├─ index.ts    # Integrates the API with the custom methods
│  └─ models.ts   # Models of the API
├─ build/         # Compiled JavaScript files
├─ view/          # Views for Electron
├─ index.html     # Main view of Electron window
├─ index.js       # 
└─ settings

```