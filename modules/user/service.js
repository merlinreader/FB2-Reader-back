import _ from "lodash";
import { Types } from "mongoose";
import { TokenGuard } from "../common/middleware/token-guard.js";
import { ACHIEVEMENTS_REGIONAL_AFFLICTION, ACHIEVEMENTS_REGIONAL_TEXT, ACHIEVEMENTS_TIME_AFFLICTION, ACHIEVEMENTS_TIME_TEXT } from "../models/achievements.js";
import User from "../models/user.js";

const picturesNames = ["rune", "blood", "stick", "dragon", "princess"];
const datesNames = Object.values(ACHIEVEMENTS_TIME_AFFLICTION);
const regionalNames = Object.values(ACHIEVEMENTS_REGIONAL_AFFLICTION);

class UserService {
    #createAchievements() {
        let counter = 0;
        const nonReceivedAchievementsSimpleMode = Object.values(ACHIEVEMENTS_REGIONAL_TEXT).flatMap((regional, regionalIndex) => {
            counter += 1;
            return Object.values(ACHIEVEMENTS_TIME_TEXT).map((date, dateIndex) => ({
                name: `${picturesNames[dateIndex]}${counter}`,
                picture: `${process.env.APP_DOMAIN}/achievements/${picturesNames[dateIndex]}${counter}.svg`,
                description: `1 место за ${date}${regional}`,
                isReceived: false,
                dateAffiliation: datesNames[dateIndex],
                regionalAffiliation: regionalNames[regionalIndex]
            }));
        });
        counter = 0;
        const nonReceivedAchievementsWordMode = Object.values(ACHIEVEMENTS_REGIONAL_TEXT).flatMap((regional, regionalIndex) => {
            counter += 1;
            return Object.values(ACHIEVEMENTS_TIME_TEXT).map((date, dateIndex) => ({
                name: `${picturesNames[dateIndex]}${counter + 3}`,
                picture: `${process.env.APP_DOMAIN}/achievements/${picturesNames[dateIndex]}${counter + 3}.svg`,
                description: `1 место за ${date}${regional}`,
                isReceived: false,
                dateAffiliation: datesNames[dateIndex],
                regionalAffiliation: regionalNames[regionalIndex]
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
            wordModeAchievements: nonReceivedAchievementsSimpleMode,
            simpleModeAchievements: nonReceivedAchievementsWordMode
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
        user.words = Array.from(new Set([...user.words, ...words]));
        user.save();
        return user.words;
    }

    async getWords(_id) {
        return await User.findById(_id).select("_id words");
    }
}

export default UserService;
