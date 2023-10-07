import { Router } from "express";
import { Validator } from "../../core/validation.js";
import StatisticController from "./controller.js";
import { anonymStatisticDTO } from "./dto/anonym-statistic-dto.js";

const router = new Router();

router.post("/anonym", Validator.validate(anonymStatisticDTO), StatisticController.addAnonymStatistic);
router.post("/user");
router.get("/daily");
router.get("/monthly");
router.get("/semi-annual");

export default router;
