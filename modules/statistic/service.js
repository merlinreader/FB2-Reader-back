import AnonymStatistic from "../models/anonim-statistic.js";

class StatisticService {
    // TODO: DELETE PASS FUNC
    async pass() {
        console.log("PASS");
    }

    async saveAnonymStatistic(anonymData) {
        await new AnonymStatistic(anonymData);
    }
}
export default StatisticService;
