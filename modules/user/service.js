import _ from "lodash";
import { Types } from "mongoose";
import { TokenGuard } from "../common/middleware/token-guard.js";
import User from "../models/user.js";

class UserService {
    async loginUser(data) {
        const userFound = await User.exists({ telegramId: data.telegramId });
        if (userFound) {
            return await TokenGuard.generate(_.pick(userFound, "_id", "telegramId"));
        }
        const userId = new Types.ObjectId();
        await new User({ _id: userId, ...data }).save();
        return await TokenGuard.generate({ _id: userId, telegramId: data.telegramId });
    }

    async editGeo(_id, country, city) {
        return await User.findByIdAndUpdate(_id, { country, city });
    }
}

export default UserService;
