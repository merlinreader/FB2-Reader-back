import { model, Schema } from "mongoose";
import { ACHIEVEMENTS_REGIONAL_AFFILIATION, ACHIEVEMENTS_TIME_AFFILIATION } from "./achievements.js";

const achievement = new Schema({
    isReceived: {
        type: Boolean,
        default: false
    },
    dateAffiliation: {
        type: String,
        enum: Object.values(ACHIEVEMENTS_TIME_AFFILIATION)
    },
    date: {
        type: Date,
        index: true
    },
    regionalAffiliation: {
        type: String,
        enum: Object.values(ACHIEVEMENTS_REGIONAL_AFFILIATION)
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
