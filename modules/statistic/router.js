import { Router } from "express";
import { Validator } from "../../core/validation.js";
import { TokenGuard } from "../common/middleware/token-guard.js";
import StatisticController from "./controller.js";
import { anonymStatisticDto } from "./dto/anonym-statistic-dto.js";
import { userStatisticDto } from "./dto/user-statistic-dto.js";

const router = new Router();

router.post("/anonym", Validator.validate(anonymStatisticDto), StatisticController.addAnonymStatistic);
router.post("/user", TokenGuard.verify, Validator.validate(userStatisticDto), StatisticController.addUserStatistic);
router.get("/daily");
router.get("/monthly");
router.get("/semi-annual");

export default router;
