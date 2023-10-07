import autoBind from "auto-bind";
import StatisticService from "./service.js";

class StatisticController {
    #StatisticService;

    constructor() {
        autoBind(this);
        this.#StatisticService = new StatisticService();
    }

    async addAnonymStatistic(req, res) {
        try {
            await this.#StatisticService(req.body);
            res.status(201).send();
        } catch (error) {
            res.status(500).json({ message: "Oops, something went wrong!!!" });
        }
    }

    async getDailyStatistic(req, res) {
        try {
            const result = "pass";
        } catch (error) {
            res.status(500).json({ message: "Oops, something went wrong!!!" });
        }
    }
    async getMonthlyStatistic(req, res) {
        try {
            const result = "pass";
        } catch (error) {
            res.status(500).json({ message: "Oops, something went wrong!!!" });
        }
    }
    async getSemiAnnualStatistic(req, res) {
        try {
            const result = "pass";
        } catch (error) {
            res.status(500).json({ message: "Oops, something went wrong!!!" });
        }
    }
}

export default new StatisticController();
