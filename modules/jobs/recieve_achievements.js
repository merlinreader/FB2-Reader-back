import { ACHIEVEMENTS_REGIONAL_AFFLICTION, ACHIEVEMENTS_TIME_AFFLICTION } from "../models/achievements.js";
import { ACHIEVEMENTS_MODE, TOTAL_PAGES } from "../models/reader_mods.js";
import User from "../models/user.js";

export default class JobsWithAchievements {
    async #getPeriod(period) {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() - 1);
        endDate.setHours(23, 59, 59, 999);
        const startDate = new Date(endDate);
        if (period == "annual") {
            startDate.setFullYear(endDate.getFullYear() - 1);
        } else if (period == "semi-annual") {
            startDate.setMonth(endDate.getMonth() - 6);
        } else if (period == "monthly") {
            startDate.setMonth(endDate.getMonth() - 1);
        } else if (period == "weekly") {
            startDate.setDate(endDate.getDate() - 7);
        } else if (period == "daily") {
            startDate.setDate(endDate.getDate() - 1);
        }
        return { startDate, endDate };
    }

    static async #putAchievements(statisticsForAwards, achievementMode, period, location) {
        statisticsForAwards.maxPageObjects.forEach(async (statistics) => {
            const user = await User.findById(statistics._id);
            const userAchievementIndex = user.achievements[achievementMode].findIndex(
                (achievement) => achievement.dateAffiliation == period && achievement.regionalAffiliation == location
            );
            if (!user.achievements[achievementMode][userAchievementIndex].isReceived) {
                user.achievements[achievementMode][userAchievementIndex].isReceived = true;
                user.save();
            }
        });
    }

    static async setDailyAchievements(stats) {
        // const endDate = new Date();
        // endDate.setDate(endDate.getDate() - 1);
        // endDate.setHours(23, 59, 59, 999);
        // const startDate = new Date(endDate);
        // startDate.setDate(endDate.getDate() - 1);
        // const aggregatedStatistics = await aggregateUserStatistic(startDate, endDate);
        // const topsOfStatisticsSimpleMod = await this.getTopOfStatistics(aggregatedStatistics, TOTAL_PAGES.SIMPLE_MODE);
        // const topsOfStatisticsWordMod = await this.getTopOfStatistics(aggregatedStatistics, TOTAL_PAGES.WORD_MODE);
        const topsOfStatisticsSimpleMod = await this.getTopOfStatistics(stats, TOTAL_PAGES.SIMPLE_MODE);
        await this.#putAchievements(
            topsOfStatisticsSimpleMod,
            ACHIEVEMENTS_MODE.SIMPLE_MODE,
            ACHIEVEMENTS_TIME_AFFLICTION.DAY,
            ACHIEVEMENTS_REGIONAL_AFFLICTION.ALL
        );
    }

    static async getTopOfStatistics(aggregatedStatistics, sortBy) {
        const result = {
            maxPageObjects: [],
            countryMaxPages: {},
            areaMaxPages: {},
            cityMaxPages: {}
        };

        aggregatedStatistics.forEach((obj) => {
            const { country, area, city } = obj;
            const fieldValue = obj[sortBy];

            if (!result.maxPageObjects.length || fieldValue > result.maxPageObjects[0][sortBy]) {
                result.maxPageObjects.length = 0;
                result.maxPageObjects.push(obj);
            } else if (fieldValue === result.maxPageObjects[0][sortBy]) {
                result.maxPageObjects.push(obj);
            }

            if (!result.countryMaxPages[country] || fieldValue > result.countryMaxPages[country][0][sortBy]) {
                result.countryMaxPages[country] = [obj];
            } else if (fieldValue === result.countryMaxPages[country][0][sortBy]) {
                result.countryMaxPages[country].push(obj);
            }

            if (!result.areaMaxPages[area] || fieldValue > result.areaMaxPages[area][sortBy]) {
                result.areaMaxPages[area] = obj;
            }

            if (!result.cityMaxPages[city] || fieldValue > result.cityMaxPages[city][sortBy]) {
                result.cityMaxPages[city] = obj;
            }
        });
        return result;
    }

    // async MonthStatistic() {}
}
