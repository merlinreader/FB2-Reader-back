import { model, Schema } from "mongoose";

const achievement = new Schema({
    name: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    isReceived: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        index: true
    }
});

const userSchema = new Schema({
    telegramId: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    country: {
        type: String
    },
    area: {
        type: String
    },
    city: {
        type: String
    },
    wordsCounter: {
        type: Number,
        default: 10
    },
    words: {
        type: [String],
        default: []
    },
    daysCounter: {
        type: Number,
        default: 0
    },
    achievements: {
        baby: {
            type: achievement
        },
        spell: {
            type: achievement
        },
        wordModeAchievements: {
            type: [achievement]
        },
        baseModeAchievements: {
            type: [achievement]
        }
    }
});

export default model("users", userSchema);
