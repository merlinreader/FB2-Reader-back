import { createReadStream } from "fs";
import { createInterface } from "readline";
import MongoAdapter from "../core/database/mongo-adapter.js";
import Word from "../modules/models/word.js";

new MongoAdapter({
    database: process.env.DB_NAME,
    host: process.env.MG_HOST || "127.0.0.1",
    port: process.env.MG_PORT || 27017,
    login: process.env.MG_USER,
    password: process.env.MG_PASS
}).handler();

const readStream = createReadStream("./scripts/resources/words.txt");
const rl = createInterface({
    input: readStream,
    crlfDelay: Infinity
});

const buffer = [];
const batchSize = 1000;

rl.on("line", (line) => {
    const words = line.trim().split(/\s+/);
    if (words.length === 1) {
        buffer.push({ word: line });
        if (buffer.length >= batchSize) {
            rl.pause();
            Word.insertMany(buffer.splice(0, batchSize))
                .then(() => {
                    rl.resume();
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }
});

rl.on("close", () => {
    if (buffer.length > 0) {
        Word.insertMany(buffer).catch(console.error);
    }
    console.log("Words in DB. Success!");
});
