# CRC-Voyages-React-App

This is the new frontend, standalone js app for the Voyages3 project

[![](https://img.shields.io/badge/npm-v8.12.2-brightgreen)](https://shields.io) [![](https://img.shields.io/badge/node-v16.15.1-orange)](https://shields.io)

Website Link: [OCI](https://voyages-staging.crc.rice.edu/)

---

## Installation

To run this application locally, you'll need to have Node.js installed on your machine. After cloning the repository, navigate to the project directory and install the dependencies
by running: `npm install`

**Deploy Problem Solution && Wordflow**
**Quick Way with Makefile**

1. Make sure you are in the `main` branch

Since we found `package-lock.json` will casuse `OCI` deployment process error, we summarized a workflow to avoid that:

1. use nvm (Node version management) tool make sure node -version is "correct <same version everybody>"

   1.1: Check your local node version by `node -v` and npm version with `npm -v`

   1.2: Make sure the versions are same as top of this README

2. Delete `node_modules` && `package-lock.json` file
3. npm install
4. Delete `node_modules`
5. npm ci
6. Locally test (run `npm run dev`, if all functions gose well, Prefect!)
7. If funciton on local serve is perfect then push & merge

### How it run on localhost:

**1. Clone the project to local**

```
git clone https://github.com/ThasaneePuttamadilok/voyages-frontend.git
```

**2. Run `npm install`**
It installs all the packages that project need. If install process failed, you clould check as follows:

**React-Route**

```javaScript
npm install --save react-router-dom

```

**Type of React-Route**

```javaScript
npm i -D @types/react@18.0.21 @types/react-dom@18.0.6
```

**To set up Redux Toolkit in your React project**

```javaScript
npm install @reduxjs/toolkit react-redux

import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers'; // Import your root reducer

const store = configureStore({
  reducer: rootReducer,
  // Add any middleware or enhancers as needed
});

export default store;

```

**Axios**

```javaScript
npm install axios
```

**Type Script**

```javaScript
npm i -D typescript
```

**To generate typeScript**

```javaScript
npx tsc --init
```

**dotenv**

```javaScript
npm i --save-dev @types/node
```

**Material UI**

```javaScript
npm install @mui/material @emotion/react @emotion/styled
```

**3. Authorization**</br>
In the `.env_sample`, you need to set `VITE_API_AUTHTOKEN` and `VITE_API_BASEURL` and change file name to `.env`

```
#Example
VITE_API_AUTHTOKEN = 'Token ABCDEF.... (replace it with your authentication token)'
VITE_API_BASEURL = 'https://voyages.ilove.you.haha..... (replace it with your own url for api call)'
```

**4. Run Application**

```javaScript
npm run dev
```

**5. Run Test Application**

```javaScript
npm run test
```

-----

## Summary of Packages

* ![Components](./src/components/package.md)
* SVAPIClient (CHANGE)
* Pages
* Redux
* Share ?
* Style
* StyleMUI
* Tests
* Utils

## Building for Production

```javascipt
npm run build
```

This will create an optimized build in the dist/ directory. The build artifacts can be deployed to a web server or hosting platform.

## License

This project is licensed under the MIT License.
