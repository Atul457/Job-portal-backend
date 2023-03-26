// Third party
import * as express from "express";
// import { Server } from "socket.io";
import http from "http";
// Configs
import { envConfig } from "./configs/env.config.js";
import { initApp } from "./configs/initApp.config.js";
// Utils
// import { socketListener } from "./utils/socket.js";
// Constants
const app = express.default();
const SOCKET_PORT = (envConfig === null || envConfig === void 0 ? void 0 : envConfig.SOCKET_PORT)
    ? Number(envConfig.SOCKET_PORT)
    : 3002;
const APP_PORT = (envConfig === null || envConfig === void 0 ? void 0 : envConfig.APP_PORT) ? Number(envConfig.APP_PORT) : 3001;
const server = http.createServer(app);
// const socketServer = new Server(server, { cors: { origin: "*" } });
// Listeners
app.listen(APP_PORT);
// socketServer.listen(SOCKET_PORT);
initApp();
// socketServer.on("connection", socketListener);
export { app };
//# sourceMappingURL=server.js.map