/* eslint-disable no-empty-function */
/* eslint-disable lines-between-class-members */
/* eslint-disable max-classes-per-file */
import cors from "cors";
import express from "express";

const TIMEOUT = 1000 * 60 * 10; // 10m

export class BaseModule {
    async beforeHandler(app) {}
    async handler(app) {}
    async afterHandler(app) {}

    async _resolve(app) {
        await this.beforeHandler(app);
        await this.handler(app);
        await this.afterHandler(app);
    }
}

class Server {
    constructor(PORT, services) {
        this.port = PORT;
        this.services = services;
        this.app = express();
        this.app.use(express.json());
        this.app.use(cors({ origin: true, credentials: true }));
    }
}

Server.prototype.initServices = async function () {
    if (!this.services.length) process.exit(1);
    for (const service of this.services) {
        await service._resolve(this.app);
    }
    console.log("Services loaded");
    return Promise.resolve(this);
};

Server.prototype.run = function (callback) {
    this.app.listen(this.port, callback).setTimeout(TIMEOUT);
};

export default Server;
