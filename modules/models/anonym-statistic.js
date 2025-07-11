import { model, Schema } from "mongoose";

const anonymStatisticSchema = Schema({
    deviceId: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    startReading: {
        type: Date,
        required: true
    },
    date: {
        type: Date,
        index: true,
        default: Date.now,
        expires: "1y"
    },
    pageCountSimpleMode: {
        type: Number,
        min: 0,
        required: true
    },
    pageCountWordMode: {
        type: Number,
        min: 0,
        required: true
    }
});

const anonymStatisticModel = model("anonym-statistics", anonymStatisticSchema);

export default anonymStatisticModel;
