import { Types } from "mongoose";
import { aggregateAnonymStatistic, aggregateUserStatistic } from "../common/functions/get-statistic-by-time.js";
import AnonymStatistic from "../models/anonym-statistic.js";
import UserStatistic from "../models/user-statistic.js";
import User from "../models/user.js";

class StatisticService {
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

    async saveAnonymStatistic(anonymData) {
        const statisticId = new Types.ObjectId();
        await new AnonymStatistic({ _id: statisticId, ...anonymData }).save();
    }

    async saveUserStatistic(_id, data) {
        const statisticId = new Types.ObjectId();
        await new UserStatistic({ _id: statisticId, userId: _id, ...data }).save();
        await User.findOneAndUpdate({ _id }, { $inc: { daysCounter: 1 } });
    }

    async getStatistic(data, period) {
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
            if (a[data.sortBy] < b[data.sortBy]) {
                return 1;
            }
            if (a[data.sortBy] > b[data.sortBy]) {
                return -1;
            }
            return 0;
        });
    }
}
export default StatisticService;
