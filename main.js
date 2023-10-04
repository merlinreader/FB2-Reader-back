import MongoAdapter from "./core/database/mongo-adapter.js";
import Server from "./core/server.js";
import SwaggerDoc from "./core/swagger.js";

const APP_PORT = process.env.PORT || 7000;

new Server(APP_PORT, [
    new MongoAdapter({
        database: process.env.DB_NAME,
        host: process.env.MG_HOST || "127.0.0.1",
        port: process.env.MG_PORT || 27017,
        login: process.env.MG_USER,
        password: process.env.MG_PASS
    }),
    new SwaggerDoc(
        {
            definition: {
                openapi: "3.0.0",
                info: {
                    title: "AIRPROMAP MASTER-API SERVER",
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
