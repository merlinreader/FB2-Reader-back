import { Router } from "express";
import StatisticController from "./controller.js";

const router = new Router();

router.post("/anonym", StatisticController.addAnonymStatistic);
router.post("/user");
router.get("/daily");
router.get("/monthly");
router.get("/semi-annual");

export default router;
