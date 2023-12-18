/* eslint-disable indent */
/* eslint-disable default-case */
import { Types } from "mongoose";
import { aggregateAnonymStatistic, aggregateUserStatistic } from "../common/functions/get-statistic-by-time.js";
import AnonymStatistic from "../models/anonym-statistic.js";
import UserStatistic from "../models/user-statistic.js";
import User from "../models/user.js";
import { PERIOD, SORT_FIELDS } from "./dto/get-statistic-dto.js";

class StatisticService {
    async #getPeriod(period) {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() - 1);
        endDate.setHours(23, 59, 59, 999);
        const startDate = new Date(endDate);
        switch (period) {
            case PERIOD.ANNUAL:
                startDate.setFullYear(endDate.getFullYear() - 1);
                break;
            case PERIOD.SEMI_ANNUAL:
                startDate.setMonth(endDate.getMonth() - 6);
                break;
            case PERIOD.MONTHLY:
                startDate.setMonth(endDate.getMonth() - 1);
                break;
            case PERIOD.WEEKLY:
                startDate.setDate(endDate.getDate() - 7);
                break;
            case PERIOD.DAILY:
                startDate.setDate(endDate.getDate() - 1);
                break;
        }
        return { startDate, endDate };
    }

    async saveAnonymStatistic(anonymData) {
        const statisticId = new Types.ObjectId();
        await new AnonymStatistic({ _id: statisticId, ...anonymData }).save();
    }

    async saveUserStatistic(_id, data) {
        const statisticId = new Types.ObjectId();
        await new UserStatistic({ _id: statisticId, userId: _id, ...data }).save();
        const user = await User.findOneAndUpdate({ _id }, { $inc: { daysCounter: 1 } }, { new: true });
        if (user.daysCounter >= 7) {
            user.achievements.spell.isReceived = true;
            user.achievements.spell.date = new Date();
        }
        user.save();
    }

    async getStatistic(data, period) {
        const [additionalSortKey] = Object.values(SORT_FIELDS).filter((sortKey) => sortKey != data.sortBy);
        const { startDate, endDate } = await this.#getPeriod(period);
        const usersStatistics = await aggregateUserStatistic(startDate, endDate);
        const anonymsStatistics = await aggregateAnonymStatistic(startDate, endDate);
        const generalStatistic = [...usersStatistics, ...anonymsStatistics].filter((item) => {
            if (data.area && item.area !== data.area) {
                return false;
            }
            if (data.city && item.city !== data.city) {
                return false;
            }
            return true;
        });
        return generalStatistic.sort((a, b) => {
            if (a[data.sortBy] < b[data.sortBy]) return 1;
            if (a[data.sortBy] > b[data.sortBy]) return -1;
            if (a[data.sortBy] == b[data.sortBy]) {
                if (a[additionalSortKey] < b[additionalSortKey]) return 1;
                if (a[additionalSortKey] > b[additionalSortKey]) return -1;
            }
            return 0;
        });
    }
}
export default StatisticService;
