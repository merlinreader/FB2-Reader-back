import { Router } from "express";
import { Validator } from "../../core/validation.js";
import { TokenGuard } from "../common/middleware/token-guard.js";
import { CONTEXT } from "../common/validators/validation.js";
import StatisticController from "./controller.js";
import { anonymStatisticDto } from "./dto/anonym-statistic-dto.js";
import { getStatisticsDto, periodDto } from "./dto/get-statistic-dto.js";
import { userStatisticDto } from "./dto/user-statistic-dto.js";

const router = new Router();

router.post("/anonym", Validator.validate(anonymStatisticDto), StatisticController.addAnonymStatistic);
router.post("/user", TokenGuard.verify, Validator.validate(userStatisticDto), StatisticController.addUserStatistic);
router.get("/:period", Validator.validate(periodDto, CONTEXT.PATH), Validator.validate(getStatisticsDto, CONTEXT.QUERY), StatisticController.getStatistic);

export default router;
