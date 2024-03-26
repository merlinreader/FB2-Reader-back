import { model, Schema } from "mongoose";

const userStatisticSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    date: {
        type: Date,
        index: true,
        default: Date.now,
        expires: "1y"
    },
    startReading: {
        type: Date,
        required: true
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

const userStatisticModel = model("user-statistics", userStatisticSchema);

export default userStatisticModel;
