import jwt from "jsonwebtoken";
import _ from "lodash";

const SECRET_KEY = process.env.SECRET_KEY || "LeamSecretWord";

export class TokenGuard {
    static verify = async (req, res, next) => {
        try {
            const { authorization } = req.headers;
            const token = authorization.split(" ")[1];
            if (!token) {
                throw new Error();
            }
            const tokenPayload = jwt.verify(token, SECRET_KEY);
            const payload = _.omit(tokenPayload, "iat", "exp");
            req.user = payload;
            next();
        } catch (error) {
            res.status(401).json({ message: "Токен не действителен" });
        }
    };

    static generate = async (payload) => {
        try {
            return jwt.sign(payload, SECRET_KEY);
        } catch (error) {
            throw new Error(error.message);
        }
    };
}
