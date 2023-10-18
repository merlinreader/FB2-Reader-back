import AnonymStatistic from "../../models/anonym-statistic.js";
import UserStatistic from "../../models/user-statistic.js";

export const aggregateUserStatistic = async (firstDate, lastDate) => {
    return await UserStatistic.aggregate([
        { $match: { date: { $gte: firstDate, $lte: lastDate } } },
        { $group: { _id: "$userId", totalPageCount: { $sum: "$pageCount" } } },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $project: {
                _id: true,
                telegramId: "$user.telegramId",
                country: "$user.country",
                area: "$user.area",
                city: "$user.city",
                totalPageCount: true
            }
        },
        { $unwind: "$telegramId" },
        { $unwind: "$country" },
        { $unwind: "$area" },
        { $unwind: "$city" }
    ]);
};

export const aggregateAnonymStatistic = async (firstDate, lastDate) => {
    return await AnonymStatistic.aggregate([
        { $match: { date: { $gte: firstDate, $lte: lastDate } } },
        {
            $group: {
                _id: "$deviceId",
                totalPageCount: { $sum: "$pageCount" },
                country: { $addToSet: "$country" },
                area: { $addToSet: "$area" },
                city: { $addToSet: "$city" }
            }
        },

        { $unwind: "$country" },
        { $unwind: "$area" },
        { $unwind: "$city" }
    ]);
};
