/* eslint-disable no-loop-func */
/* eslint-disable guard-for-in */
import autoBind from "auto-bind";
import { aggregateUserStatistic } from "../common/functions/get-statistic-by-time.js";
import { ACHIEVEMENTS_REGIONAL_AFFLICTION, ACHIEVEMENTS_TIME_AFFLICTION } from "../models/achievements.js";
import { ACHIEVEMENTS_MODE, TOTAL_PAGES } from "../models/reader-mods.js";
import User from "../models/user.js";

class JobsWithAchievements {
    constructor() {
        autoBind(this);
    }

    async #putAchievements(statisticsForAwards, achievementMode, period) {
        for (const statistics of statisticsForAwards.maxPageObjects) {
            const user = await User.findById(statistics._id);
            const userAchievementIndex = user.achievements[achievementMode].findIndex(
                (achievement) => achievement.dateAffiliation == period && achievement.regionalAffiliation == ACHIEVEMENTS_REGIONAL_AFFLICTION.ALL
            );
            if (!user.achievements[achievementMode][userAchievementIndex].isReceived) {
                user.achievements[achievementMode][userAchievementIndex].isReceived = true;
                user.achievements[achievementMode][userAchievementIndex].date = new Date();
                user.save();
            }
        }
        delete statisticsForAwards.maxPageObjects;
        delete statisticsForAwards.countryMaxPages;
        const locations = Object.values(ACHIEVEMENTS_REGIONAL_AFFLICTION);
        let index = 0;
        for (const regionalStatistic in statisticsForAwards) {
            const usersIds = [];
            Object.values(statisticsForAwards[regionalStatistic])
                .flat()
                .forEach((statistic) => {
                    usersIds.push(statistic._id);
                });
            const users = await User.find({ _id: { $in: usersIds } });
            users.forEach((user) => {
                const userAchievementIndex = user.achievements[achievementMode].findIndex(
                    (achievement) => achievement.dateAffiliation == period && achievement.regionalAffiliation == locations[index]
                );
                if (!user.achievements[achievementMode][userAchievementIndex].isReceived) {
                    user.achievements[achievementMode][userAchievementIndex].isReceived = true;
                    user.achievements[achievementMode][userAchievementIndex].date = new Date();
                    user.save();
                }
            });
            index += 1;
        }
    }

    async #getTopOfStatistics(aggregatedStatistics, sortBy) {
        const result = {
            maxPageObjects: [],
            cityMaxPages: {},
            areaMaxPages: {},
            countryMaxPages: {}
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

    async setDailyAchievements() {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() - 1);
        endDate.setHours(23, 59, 59, 999);
        const startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 1);
        const aggregatedStatistics = await aggregateUserStatistic(startDate, endDate);
        const topsOfStatisticsSimpleMod = await this.#getTopOfStatistics(aggregatedStatistics, TOTAL_PAGES.SIMPLE_MODE);
        const topsOfStatisticsWordMod = await this.#getTopOfStatistics(aggregatedStatistics, TOTAL_PAGES.WORD_MODE);
        await this.#putAchievements(topsOfStatisticsSimpleMod, ACHIEVEMENTS_MODE.SIMPLE_MODE, ACHIEVEMENTS_TIME_AFFLICTION.DAY);
        await this.#putAchievements(topsOfStatisticsWordMod, ACHIEVEMENTS_MODE.WORD_MODE, ACHIEVEMENTS_TIME_AFFLICTION.DAY);
    }

    async setWeeklyAchievements() {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() - 1);
        endDate.setHours(23, 59, 59, 999);
        const startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 7);
        const aggregatedStatistics = await aggregateUserStatistic(startDate, endDate);
        const topsOfStatisticsSimpleMod = await this.#getTopOfStatistics(aggregatedStatistics, TOTAL_PAGES.SIMPLE_MODE);
        const topsOfStatisticsWordMod = await this.#getTopOfStatistics(aggregatedStatistics, TOTAL_PAGES.WORD_MODE);
        await this.#putAchievements(topsOfStatisticsSimpleMod, ACHIEVEMENTS_MODE.SIMPLE_MODE, ACHIEVEMENTS_TIME_AFFLICTION.WEEK);
        await this.#putAchievements(topsOfStatisticsWordMod, ACHIEVEMENTS_MODE.WORD_MODE, ACHIEVEMENTS_TIME_AFFLICTION.WEEK);
    }

    async setMonthlyAchievements() {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() - 1);
        endDate.setHours(23, 59, 59, 999);
        const startDate = new Date(endDate);
        startDate.setMonth(endDate.getMonth() - 1);
        const aggregatedStatistics = await aggregateUserStatistic(startDate, endDate);
        const topsOfStatisticsSimpleMod = await this.#getTopOfStatistics(aggregatedStatistics, TOTAL_PAGES.SIMPLE_MODE);
        const topsOfStatisticsWordMod = await this.#getTopOfStatistics(aggregatedStatistics, TOTAL_PAGES.WORD_MODE);
        await this.#putAchievements(topsOfStatisticsSimpleMod, ACHIEVEMENTS_MODE.SIMPLE_MODE, ACHIEVEMENTS_TIME_AFFLICTION.MONTH);
        await this.#putAchievements(topsOfStatisticsWordMod, ACHIEVEMENTS_MODE.WORD_MODE, ACHIEVEMENTS_TIME_AFFLICTION.MONTH);
    }

    async setSemiAnnualAchievements() {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() - 1);
        endDate.setHours(23, 59, 59, 999);
        const startDate = new Date(endDate);
        startDate.setMonth(endDate.getMonth() - 6);
        const aggregatedStatistics = await aggregateUserStatistic(startDate, endDate);
        const topsOfStatisticsSimpleMod = await this.#getTopOfStatistics(aggregatedStatistics, TOTAL_PAGES.SIMPLE_MODE);
        const topsOfStatisticsWordMod = await this.#getTopOfStatistics(aggregatedStatistics, TOTAL_PAGES.WORD_MODE);
        await this.#putAchievements(topsOfStatisticsSimpleMod, ACHIEVEMENTS_MODE.SIMPLE_MODE, ACHIEVEMENTS_TIME_AFFLICTION.SEMI_ANNUAL);
        await this.#putAchievements(topsOfStatisticsWordMod, ACHIEVEMENTS_MODE.WORD_MODE, ACHIEVEMENTS_TIME_AFFLICTION.SEMI_ANNUAL);
    }

    async setYearAchievements() {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() - 1);
        endDate.setHours(23, 59, 59, 999);
        const startDate = new Date(endDate);
        startDate.setFullYear(endDate.getFullYear() - 1);
        const aggregatedStatistics = await aggregateUserStatistic(startDate, endDate);
        const topsOfStatisticsSimpleMod = await this.#getTopOfStatistics(aggregatedStatistics, TOTAL_PAGES.SIMPLE_MODE);
        const topsOfStatisticsWordMod = await this.#getTopOfStatistics(aggregatedStatistics, TOTAL_PAGES.WORD_MODE);
        await this.#putAchievements(topsOfStatisticsSimpleMod, ACHIEVEMENTS_MODE.SIMPLE_MODE, ACHIEVEMENTS_TIME_AFFLICTION.YEAR);
        await this.#putAchievements(topsOfStatisticsWordMod, ACHIEVEMENTS_MODE.WORD_MODE, ACHIEVEMENTS_TIME_AFFLICTION.YEAR);
    }
}

export default new JobsWithAchievements();
