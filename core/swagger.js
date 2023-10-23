import swaggerJSDoc from "swagger-jsdoc";
import SwaggerUI from "swagger-ui-express";
import { BaseModule } from "./server.js";

export default class SwaggerDoc extends BaseModule {
    #options;

    constructor(options) {
        super();
        this.#options = options;
    }

    async handler(app) {
        const document = swaggerJSDoc(this.#options);
        app.use("/docs", SwaggerUI.serve, SwaggerUI.setup(document));
    }
}
