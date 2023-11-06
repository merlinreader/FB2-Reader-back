import _ from "lodash";
import { Types } from "mongoose";
import { TokenGuard } from "../common/middleware/token-guard.js";
import { ACHIEVEMENTS_REGIONAL_AFFILIATION, ACHIEVEMENTS_TIME_AFFILIATION } from "../models/achievements.js";
import User from "../models/user.js";

const picturesNames = ["rune", "blood", "stick", "dragon", "princess"];

class UserService {
    #createAchievements() {
        let counter = 0;
        const nonReceivedAchievementsBasicMode = Object.values(ACHIEVEMENTS_REGIONAL_AFFILIATION).flatMap((regional) => {
            counter += 1;
            return Object.values(ACHIEVEMENTS_TIME_AFFILIATION).map((date, index) => ({
                name: `${picturesNames[index]}${counter}`,
                picture: `${process.env.APP_DOMAIN}/achievements/${picturesNames[index]}${counter}.svg`,
                description: `1 место за ${date}${regional}`,
                isReceived: false,
                dateAffiliation: date,
                regionalAffiliation: regional
            }));
        });
        counter = 0;
        const nonReceivedAchievementsWordMode = Object.values(ACHIEVEMENTS_REGIONAL_AFFILIATION).flatMap((regional) => {
            counter += 1;
            return Object.values(ACHIEVEMENTS_TIME_AFFILIATION).map((date, index) => ({
                name: `${picturesNames[index]}${counter + 3}`,
                picture: `${process.env.APP_DOMAIN}/achievements/${picturesNames[index]}${counter + 3}.svg`,
                description: `1 место за ${date}${regional}`,
                isReceived: false,
                dateAffiliation: date,
                regionalAffiliation: regional
            }));
        });
        return {
            baby: {
                name: "baby",
                picture: `${process.env.APP_DOMAIN}/achievements/baby.svg`,
                description: "Первый вход в игру",
                isReceived: true,
                date: Date.now()
            },
            spell: {
                name: "spell",
                picture: `${process.env.APP_DOMAIN}/achievements/spell.svg`,
                description: "7 дней с нами",
                isReceived: false
            },
            wordModeAchievements: nonReceivedAchievementsBasicMode,
            baseModeAchievements: nonReceivedAchievementsWordMode
        };
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

    async editGeo(_id, data) {
        return await User.findByIdAndUpdate(_id, data);
    }

    async editName(_id, data) {
        return await User.findByIdAndUpdate(_id, data);
    }

    async getSelfData(_id) {
        return await User.findById(_id).select("-achievements -words");
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
