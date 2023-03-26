// Third party
import * as express from "express";

// Configs
import { envConfig } from "./configs/env.config.js";
import { initApp } from "./configs/initApp.config.js";

// Constants
const app = express.default();
const APP_PORT = envConfig?.APP_PORT ? Number(envConfig.APP_PORT) : 3001;

// Listeners
app.listen(APP_PORT);
initApp();

export { app };