import _ from "lodash";
import { Types } from "mongoose";
import { TokenGuard } from "../common/middleware/token-guard.js";
import { ACHIEVEMENTS_REGIONAL_AFFILIATION, ACHIEVEMENTS_TIME_AFFILIATION } from "../models/achievements.js";
import User from "../models/user.js";

class UserService {
    #createAchievements() {
        const nonReceivedAchievements = Object.values(ACHIEVEMENTS_REGIONAL_AFFILIATION).flatMap((regional) =>
            Object.values(ACHIEVEMENTS_TIME_AFFILIATION).map((date) => ({
                isReceived: false,
                dateAffiliation: date,
                regionalAffiliation: regional
            }))
        );
        return {
            baby: {
                isReceived: true,
                date: Date.now()
            },
            spell: {
                isReceived: false
            },
            wordModeAchievements: nonReceivedAchievements,
            baseModeAchievements: nonReceivedAchievements
        };
    }

    async loginUser(data) {
        const userFound = await User.findOne({ telegramId: data.telegramId });
        if (userFound) {
            return {
                token: await TokenGuard.generate(_.pick(userFound, "_id", "telegramId"))
            };
        }
        const userId = new Types.ObjectId();
        await new User({
            _id: userId,
            achievements: this.#createAchievements(),
            ...data
        }).save();
        return {
            token: await TokenGuard.generate({ _id: userId, telegramId: data.telegramId })
        };
    }

    async editGeo(_id, data) {
        return await User.findByIdAndUpdate(_id, data);
    }

    async editName(_id, data) {
        return await User.findByIdAndUpdate(_id, data);
    }

    async getSelfData(_id) {
        return await User.findById(_id).select("-achievements -words");
        // const user = await User.findById(_id);
        // user.tempKey = null;
        // user.save();
        // return _.omit(user, "achievements", "words");
    }

    async getAchievements(_id) {
        return await User.findById(_id).select("_id achievements");
    }

    async putWords(_id, words) {
        const user = await User.findById(_id);
        if (words.length > user.wordsCounter - user.words.length) return [false, user.wordsCounter - user.words.length];
        user.words = Array.from(new Set([...user.words, ...words]));
        user.save();
        return [true, user.words];
    }

    async getWords(_id) {
        return await User.findById(_id).select("_id words");
    }
}

export default UserService;
