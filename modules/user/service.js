import _ from "lodash";
import { Types } from "mongoose";
import { TokenGuard } from "../common/middleware/token-guard.js";
import User from "../models/user.js";

class UserService {
    async loginUser(data) {
        const userFound = await User.exists({ telegramId: data.telegramId });
        if (userFound) {
            return {
                token: await TokenGuard.generate(_.pick(userFound, "_id", "telegramId")),
                _id: userFound._id
            };
        }
        const userId = new Types.ObjectId();
        await new User({ _id: userId, ...data }).save();
        return {
            token: await TokenGuard.generate({ _id: userId, telegramId: data.telegramId }),
            _id: userId
        };
    }

    async editGeo(_id, country, city) {
        return await User.findByIdAndUpdate(_id, { country, city });
    }
}

export default UserService;
