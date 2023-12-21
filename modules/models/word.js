import { model, Schema } from "mongoose";

const wordSchema = new Schema({
    word: {
        type: String,
        required: true
    }
});

export default model("words", wordSchema);
