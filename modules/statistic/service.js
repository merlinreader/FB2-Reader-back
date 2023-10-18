import { Types } from "mongoose";
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
}
export default StatisticService;
