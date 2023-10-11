import { model, Schema } from "mongoose";

const userSchema = new Schema({
    telegramId: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    secondName: {
        type: String
    },
    country: {
        type: String
    },
    city: {
        type: String
    }
});

export default model("users", userSchema);
