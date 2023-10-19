import { Types } from "mongoose";
import { aggregateAnonymStatistic, aggregateUserStatistic } from "../common/functions/get-statistic-by-time.js";
import AnonymStatistic from "../models/anonym-statistic.js";
import UserStatistic from "../models/user-statistic.js";
import User from "../models/user.js";

class StatisticService {
    async saveAnonymStatistic(anonymData) {
        const statisticId = new Types.ObjectId();
        await new AnonymStatistic({ _id: statisticId, ...anonymData }).save();
    }

    async saveUserStatistic(pageCount, _id) {
        const statisticId = new Types.ObjectId();
        await new UserStatistic({ _id: statisticId, userId: _id, pageCount }).save();
        await User.findOneAndUpdate({ _id }, { $inc: { daysCounter: 1 } });
    }

    async getAnnualStatistic(data) {
        const startOfYear = new Date();
        startOfYear.setMonth(0, 1);
        startOfYear.setHours(0, 0, 0, 0);
        const endOfYear = new Date();
        endOfYear.setMonth(11, 31);
        endOfYear.setHours(23, 59, 59, 999);
        const usersStatistics = await aggregateUserStatistic(startOfYear, endOfYear);
        const anonymsStatistics = await aggregateAnonymStatistic(startOfYear, endOfYear);
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
            if (a.totalPageCount < b.totalPageCount) {
                return 1;
            }
            if (a.totalPageCount > b.totalPageCount) {
                return -1;
            }
            return 0;
        });
    }
}
export default StatisticService;
