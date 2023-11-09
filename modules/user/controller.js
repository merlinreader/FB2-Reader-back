import autoBind from "auto-bind";
import { SERVER_500_ERROR } from "../common/vars/messages.js";
import UserService from "./service.js";

class UserController {
    #userService;

    constructor() {
        autoBind(this);
        this.#userService = new UserService();
    }

    async login(req, res) {
        try {
            const result = await this.#userService.loginUser(req.body);
            res.status(200).json(result);
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: SERVER_500_ERROR });
        }
    }

    async editGeo(req, res) {
        try {
            await this.#userService.editGeo(req.user._id, req.body);
            res.status(200).end();
        } catch (error) {
            res.status(500).json({ message: SERVER_500_ERROR });
        }
    }

    async editName(req, res) {
        try {
            await this.#userService.editName(req.user._id, req.body);
            res.status(200).end();
        } catch (error) {
            res.status(500).json({ message: SERVER_500_ERROR });
        }
    }

    async getSelfData(req, res) {
        try {
            res.status(200).json(await this.#userService.getSelfData(req.user._id));
        } catch (error) {
            res.status(500).json({ message: SERVER_500_ERROR });
        }
    }

    async getAchievements(req, res) {
        try {
            res.status(200).json(await this.#userService.getAchievements(req.user._id));
        } catch (error) {
            res.status(500).json({ message: SERVER_500_ERROR });
        }
    }

    async getAccountAvatars(req, res) {
        try {
            res.status(200).json(await this.#userService.getAccountAvatars(req.user._id));
        } catch (error) {
            res.status(500).json({ message: SERVER_500_ERROR });
        }
    }

    async patchWords(req, res) {
        try {
            await this.#userService.patchWords(req.user._id);
            res.status(200).end();
        } catch (error) {
            res.status(500).json({ message: SERVER_500_ERROR });
        }
    }

    async getWords(req, res) {
        try {
            res.status(200).json(await this.#userService.getWords(req.user._id));
        } catch (error) {
            res.status(500).json({ message: SERVER_500_ERROR });
        }
    }
}

export default new UserController();
