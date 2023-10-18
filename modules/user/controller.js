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
            console.log(error.message);
            res.status(500).json({ message: "Something went wrong" });
        }
    }

    async editGeo(req, res) {
        try {
            await this.#userService.editGeo(req.user._id, req.body);
            res.status(200).json({ message: "Success" });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: "Something went wrong" });
        }
    }

    async editName(req, res) {
        try {
            await this.#userService.editName(req.user._id, req.body);
            res.status(200).json({ message: "Success" });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: "Something went wrong" });
        }
    }
}

export default new UserController();
