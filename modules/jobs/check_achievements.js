// import { ACHIEVEMENTS_REGIONAL_AFFILIATION } from "../models/achievements.js";
import UserStatistic from "../models/user-statistic.js";
// import User from "../models/user.js";

// export default async () => {
//     const [maxDailyStatistic] = await userStatistic.aggregate([{ $sort: { pageCountSimpleMode: -1 } }, { $limit: 1 }]);
//     console.log(maxDailyStatistic.date);
//     await User.findByIdAndUpdate(maxDailyStatistic.userId, { $push: { achievements: { date: maxDailyStatistic.date, type: ACHIEVEMENTS_REGIONAL_AFFILIATION.ALL } } });
// };

export default class JobsWithAchievements {
    async #AggregateStatistic(firstDate, lastDate) {
        return await UserStatistic.aggregate([
            { $match: { date: { $gte: firstDate, $lte: lastDate } } },
            { $group: { _id: "$userId", totalPageCountSimpleMode: { $sum: "$pageCountSimpleMode" } } },
            { $sort: { totalPageCountSimpleMode: -1 } }
        ]);
    }

    // async MonthStatistic() {}
}
