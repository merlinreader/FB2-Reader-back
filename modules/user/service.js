import _ from "lodash";
import { Types } from "mongoose";
import { TokenGuard } from "../common/middleware/token-guard.js";
import { ACHIEVEMENTS_REGIONAL_AFFILIATION, ACHIEVEMENTS_TIME_AFFILIATION } from "../models/achievements.js";
import User from "../models/user.js";

class UserService {
    #createAchievements() {
        const nonReceivedAchievements = [];
        for (const regional of Object.values(ACHIEVEMENTS_REGIONAL_AFFILIATION)) {
            for (const date of Object.values(ACHIEVEMENTS_TIME_AFFILIATION)) {
                nonReceivedAchievements.push({
                    isReceived: false,
                    dateAffiliation: date,
                    regionalAffiliation: regional
                });
            }
        }
        const achievements = {
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
        return achievements;
    }

    async loginUser(data) {
        const userFound = await User.exists({ telegramId: data.telegramId });
        if (userFound) {
            return {
                token: await TokenGuard.generate(_.pick(userFound, "_id", "telegramId")),
                _id: userFound._id
            };
        }
        const userId = new Types.ObjectId();
        await new User({
            _id: userId,
            achievements: this.#createAchievements(),
            ...data
        }).save();
        return {
            token: await TokenGuard.generate({ _id: userId, telegramId: data.telegramId }),
            _id: userId
        };
    }

    async editGeo(_id, country, city) {
        return await User.findByIdAndUpdate(_id, { country, city });
    }

    async editName(_id, data) {
        return await User.findByIdAndUpdate(_id, data);
    }
}

export default UserService;
