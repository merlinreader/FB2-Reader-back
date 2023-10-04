import { model, Schema } from "mongoose";

const userSchema = new Schema({
    telegramId: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    surname: {
        type: String
    },
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    }
});

export default model("users", userSchema);
