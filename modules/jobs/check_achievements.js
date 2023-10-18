// import { ACHIEVEMENTS_REGIONAL_AFFILIATION } from "../models/achievements.js";
// import userStatistic from "../models/user-statistic.js";
// import User from "../models/user.js";

// export default async () => {
//     const [maxDailyStatistic] = await userStatistic.aggregate([{ $sort: { pageCount: -1 } }, { $limit: 1 }]);
//     console.log(maxDailyStatistic.date);
//     await User.findByIdAndUpdate(maxDailyStatistic.userId, { $push: { achievements: { date: maxDailyStatistic.date, type: ACHIEVEMENTS_REGIONAL_AFFILIATION.ALL } } });
// };
