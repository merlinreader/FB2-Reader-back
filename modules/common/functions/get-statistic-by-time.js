import AnonymStatistic from "../../models/anonym-statistic.js";
import UserStatistic from "../../models/user-statistic.js";

export const aggregateUserStatistic = async (firstDate, lastDate) => {
    return await UserStatistic.aggregate([
        { $match: { date: { $gte: firstDate, $lte: lastDate } } },
        {
            $group: {
                _id: "$userId",
                totalPageCountSimpleMode: { $sum: "$pageCountSimpleMode" },
                totalPageCountWordMode: { $sum: "$pageCountWordMode" }
            }
        },
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
                firstName: "$user.firstName",
                country: "$user.country",
                area: "$user.area",
                city: "$user.city",
                totalPageCountSimpleMode: true,
                totalPageCountWordMode: true
            }
        },
        { $unwind: "$telegramId" },
        { $unwind: "$firstName" },
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
                totalPageCountSimpleMode: { $sum: "$pageCountSimpleMode" },
                totalPageCountWordMode: { $sum: "$pageCountWordMode" },
                country: { $addToSet: "$country" },
                area: { $addToSet: "$area" },
                city: { $addToSet: "$city" }
            }
        },
        {
            $project: {
                _id: true,
                firstName: "merlin",
                totalPageCountSimpleMode: true,
                totalPageCountWordMode: true,
                country: true,
                area: true,
                city: true
            }
        },
        { $unwind: "$country" },
        { $unwind: "$area" },
        { $unwind: "$city" }
    ]);
};
