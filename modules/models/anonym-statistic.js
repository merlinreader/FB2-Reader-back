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
    date: {
        type: Date,
        index: true,
        default: Date.now,
        expires: "1y"
    },
    pageCount: {
        type: Number,
        min: 0,
        required: true
    }
});

const anonymStatisticModel = model("anonym-statistics", anonymStatisticSchema);
anonymStatisticModel.ensureIndexes();

export default anonymStatisticModel;
