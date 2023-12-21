import Scheduler from "./core/cron.js";
import MongoAdapter from "./core/database/mongo-adapter.js";
import Routing from "./core/routes.js";
import Server from "./core/server.js";
import SwaggerDoc from "./core/swagger.js";
import Tasks from "./modules/jobs/_index.js";
import EnsureIndexModels from "./modules/models/_ensure_indexes.js";
import StatisticRouter from "./modules/statistic/router.js";
import UserRouter from "./modules/user/router.js";

const APP_PORT = process.env.PORT || 7000;
const GLOBAL_PREFIX = process.env.PREFIX || "";

new Server(APP_PORT, [
    new MongoAdapter({
        database: process.env.DB_NAME,
        host: process.env.MG_HOST || "127.0.0.1",
        port: process.env.MG_PORT || 27017,
        login: process.env.MG_USER,
        password: process.env.MG_PASS
    }).registerIndexes(EnsureIndexModels),
    new Routing(GLOBAL_PREFIX, [
        { prefix: "/statistic", router: StatisticRouter },
        { prefix: "/account", router: UserRouter }
    ]),
    new Scheduler(Tasks),
    new SwaggerDoc(
        {
            definition: {
                openapi: "3.0.0",
                info: {
                    title: "Merlin MASTER-API SERVER",
                    version: "1.0.0",
                    description: "The REST API documentation for FB2-Master-Server.",
                    contact: {
                        name: "LeamSoftware",
                        url: "https://leam.pro"
                    }
                },
                servers: [{ url: process.env.APP_DOMAIN }],
                components: {
                    securitySchemes: {
                        bearer: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
                    }
                },
                security: [{ bearer: [] }]
            },
            apis: ["./documents/**/*.yml", "./documents/**/*.yaml"]
        },
        { docExpansion: "none" }
    )
])
    .initServices()
    .then((server) => server.run(() => console.log("Server started on port %s", APP_PORT)));
