import mongoose from "mongoose";
import { BaseModule } from "../server.js";

export default class MongoAdapter extends BaseModule {
    #connectionString;
    #database;
    #models = [];

    constructor({ host, login, password, database, port = 27017 }) {
        super();
        this.#database = database;
        this.#connectionString = `mongodb://${login}:${password}@${host}:${port}`;
    }

    registerIndexes(models) {
        this.#models = models;
        return this;
    }

    async handler(_) {
        try {
            mongoose.set("strictQuery", true);
            mongoose.set("autoIndex", false);
            await mongoose.connect(this.#connectionString, { dbName: this.#database });
            console.log("Connection to mongo-DB is established");
        } catch (ex) {
            console.log(ex);
            console.error("Unable connect to mongo-db");
            process.exit(1);
        }
    }

    async afterHandler(_) {
        this.#models.forEach((model) => model.ensureIndexes());
    }
}
