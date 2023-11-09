import { model, Schema } from "mongoose";
import { ACHIEVEMENTS_REGIONAL_AFFLICTION, ACHIEVEMENTS_TIME_AFFLICTION } from "./achievements.js";

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
    },
    dateAffiliation: {
        type: String,
        enum: Object.values(ACHIEVEMENTS_TIME_AFFLICTION)
    },
    regionalAffiliation: {
        type: String,
        enum: Object.values(ACHIEVEMENTS_REGIONAL_AFFLICTION)
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
        default: 0
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
        simpleModeAchievements: {
            type: [achievement]
        }
    }
});

export default model("users", userSchema);
