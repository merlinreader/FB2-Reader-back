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
            await this.#StatisticService.saveAnonymStatistic(req.body);
            res.status(201).json();
        } catch (error) {
            res.status(500).json({ message: "Oops, something went wrong!!!" });
        }
    }

    async addUserStatistic(req, res) {
        try {
            await this.#StatisticService.saveUserStatistic(req.body.pageCount, req.user._id);
            res.status(201).json();
        } catch (error) {
            res.status(500).json({ message: "Oops, something went wrong!!!" });
            console.log(error.message);
        }
    }

    async getAnnualStatistic(req, res) {
        try {
            const statistics = await this.#StatisticService.getAnnualStatistic(req.query);
            res.status(200).json(statistics);
        } catch (error) {
            res.status(500).json({ message: "Oops, something went wrong!!!" });
            console.log(error.message);
        }
    }
}

export default new StatisticController();
