import autoBind from "auto-bind";
import { SERVER_500_ERROR } from "../common/vars/messages.js";
import StatisticService from "./service.js";

class StatisticController {
    #StatisticService;

    constructor() {
        autoBind(this);
        this.#StatisticService = new StatisticService();
    }

    async addAnonymStatistic(req, res) {
        try {
            await this.#StatisticService.saveAnonymStatistic(req.body);
            res.status(201).json();
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: SERVER_500_ERROR });
        }
    }

    async addUserStatistic(req, res) {
        try {
            await this.#StatisticService.saveUserStatistic(req.user._id, req.body);
            res.status(201).json();
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: SERVER_500_ERROR });
        }
    }

    async getStatistic(req, res) {
        try {
            const statistics = await this.#StatisticService.getStatistic(req.query, req.params.period);
            res.status(200).json(statistics);
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: SERVER_500_ERROR });
        }
    }
}

export default new StatisticController();
