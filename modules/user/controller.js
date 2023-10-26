import autoBind from "auto-bind";
import UserService from "./service.js";

class UserController {
    #userService;

    constructor() {
        autoBind(this);
        this.#userService = new UserService();
    }

    async login(req, res) {
        try {
            const token = await this.#userService.loginUser(req.body);
            res.status(200).json(token);
        } catch (error) {
            res.status(500).json({ message: "Something went wrong" });
        }
    }

    async editGeo(req, res) {
        try {
            await this.#userService.editGeo(req.user._id, req.body);
            res.status(200).json({ message: "Success" });
        } catch (error) {
            res.status(500).json({ message: "Something went wrong" });
        }
    }

    async editName(req, res) {
        try {
            await this.#userService.editName(req.user._id, req.body);
            res.status(200).json({ message: "Success" });
        } catch (error) {
            res.status(500).json({ message: "Something went wrong" });
        }
    }

    async getSelfData(req, res) {
        try {
            res.status(200).json(await this.#userService.getSelfData(req.user._id));
        } catch (error) {
            res.status(500).json({ message: "Something went wrong" });
        }
    }

    async getAchievements(req, res) {
        try {
            res.status(200).json(await this.#userService.getAchievements(req.user._id));
        } catch (error) {
            res.status(500).json({ message: "Something went wrong" });
        }
    }

    async putWords(req, res) {
        try {
            const [status, result] = await this.#userService.putWords(req.user._id, req.body.words);
            if (status) return res.status(200).json({ userWords: result });
            res.status(403).json({ message: `У вас осталось ${result} свободных слов` });
        } catch (error) {
            res.status(500).json({ message: "Something went wrong" });
        }
    }

    async getWords(req, res) {
        try {
            res.status(200).json(await this.#userService.getWords(req.user._id));
        } catch (error) {
            res.status(500).json({ message: "Something went wrong" });
        }
    }
}

export default new UserController();
