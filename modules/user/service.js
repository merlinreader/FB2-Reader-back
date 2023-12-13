/* eslint-disable array-callback-return */
import _ from "lodash";
import { Types } from "mongoose";
import { TokenGuard } from "../common/middleware/token-guard.js";
import { ACHIEVEMENTS_REGIONAL_AFFLICTION, ACHIEVEMENTS_REGIONAL_TEXT, ACHIEVEMENTS_TIME_AFFLICTION, ACHIEVEMENTS_TIME_TEXT } from "../models/achievements.js";
import User from "../models/user.js";

const picturesNames = ["rune", "blood", "stick", "dragon", "princess"];
const datesNames = Object.values(ACHIEVEMENTS_TIME_AFFLICTION);
const regionalNames = Object.values(ACHIEVEMENTS_REGIONAL_AFFLICTION);
const appMode = { SIMPLE: "страницы", WORD: '"Слово"' };

class UserService {
    #createAchievements() {
        const nonReceivedAchievementsSimpleMode = Object.values(ACHIEVEMENTS_REGIONAL_TEXT).flatMap((regional, regionalIndex) => {
            return Object.values(ACHIEVEMENTS_TIME_TEXT).map((date, dateIndex) => ({
                name: `${picturesNames[dateIndex]}${regionalIndex + 1}`,
                picture: `/achievements/${picturesNames[dateIndex]}${regionalIndex + 1}.png`,
                description: `1 место за ${date}${regional}`,
                isReceived: false,
                dateAffiliation: datesNames[dateIndex],
                regionalAffiliation: regionalNames[regionalIndex]
            }));
        });
        const nonReceivedAchievementsWordMode = Object.values(ACHIEVEMENTS_REGIONAL_TEXT).flatMap((regional, regionalIndex) => {
            return Object.values(ACHIEVEMENTS_TIME_TEXT).map((date, dateIndex) => ({
                name: `${picturesNames[dateIndex]}${regionalIndex + 4}`,
                picture: `/achievements/${picturesNames[dateIndex]}${regionalIndex + 4}.png`,
                description: `1 место за ${date}${regional} в режиме ${appMode.WORD}`,
                isReceived: false,
                dateAffiliation: datesNames[dateIndex],
                regionalAffiliation: regionalNames[regionalIndex]
            }));
        });
        return {
            baby: {
                name: "baby",
                picture: `/achievements/baby.png`,
                description: "Первый вход в игру",
                isReceived: true,
                date: Date.now()
            },
            spell: {
                name: "spell",
                picture: `/achievements/spell.png`,
                description: "7 дней с нами",
                isReceived: false
            },
            wordModeAchievements: nonReceivedAchievementsSimpleMode,
            simpleModeAchievements: nonReceivedAchievementsWordMode
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
        const user = await User.findById(_id).select("-achievements -words");
        user.avatar.picture = `${process.env.APP_DOMAIN}${user.avatar.picture}`;
        return user;
    }

    async getAchievements(_id) {
        const { achievements } = await User.findById(_id).select("achievements");
        achievements.baby.picture = `${process.env.APP_DOMAIN}${achievements.baby.picture}`;
        achievements.spell.picture = `${process.env.APP_DOMAIN}${achievements.spell.picture}`;
        achievements.wordModeAchievements = achievements.wordModeAchievements.map((achievement) => {
            return { ..._.omit(achievement, "picture"), picture: `${process.env.APP_DOMAIN}${achievement.picture}` };
        });
        achievements.simpleModeAchievements = achievements.simpleModeAchievements.map((achievement) => {
            return { ..._.omit(achievement, "picture"), picture: `${process.env.APP_DOMAIN}${achievement.picture}` };
        });
        return { achievements };
    }

    async getAccountAvatars(_id) {
        const user = await User.findById(_id);
        const avatars = [];
        Object.values(user.achievements)
            .flat()
            .forEach((achievement) => achievement.isReceived && avatars.push(_.pick(achievement, "_id", "name", "picture")));
        return avatars.map((achievement) => {
            return { _id: achievement._id, name: achievement.name, picture: `${process.env.APP_DOMAIN}${achievement.picture}` };
        });
    }

    async patchWords(_id) {
        await User.findByIdAndUpdate(_id, { $inc: { wordsCounter: 10 } });
    }

    async getWords(_id) {
        await User.findById(_id).select("wordsCounter");
    }

    async editAvatar(_id, name) {
        const { avatar } = await User.findByIdAndUpdate(_id, { avatar: { picture: `/achievements/${name}.png`, name } }, { new: true }).select("avatar");
        console.log(name);
        return { picture: `${process.env.APP_DOMAIN}${avatar.picture}` };
    }
}

export default UserService;
