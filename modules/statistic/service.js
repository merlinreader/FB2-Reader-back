import { Types } from "mongoose";
import AnonymStatistic from "../models/anonym-statistic.js";
import UserStatistic from "../models/user-statistic.js";

class StatisticService {
    // TODO: DELETE PASS FUNC
    async pass() {
        console.log("PASS");
    }

    async saveAnonymStatistic(anonymData) {
        const statisticId = new Types.ObjectId();
        await new AnonymStatistic({ _id: statisticId, ...anonymData }).save();
    }

    async saveUserStatistic(pageCount, _id) {
        const statisticId = new Types.ObjectId();
        await new UserStatistic({ _id: statisticId, userId: _id, pageCount }).save();
    }
}
export default StatisticService;
