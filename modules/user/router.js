import { Router } from "express";
import { Validator } from "../../core/validation.js";
import { TokenGuard } from "../common/middleware/token-guard.js";
import UserController from "./controller.js";
import { geoSetDTO } from "./dto/geo-edit-dto.js";
import { loginDto } from "./dto/login-dto.js";
import { nameEditDto } from "./dto/name-edit-dto.js";

const router = new Router();

router.post("/login", Validator.validate(loginDto), UserController.login);
router.get("/", TokenGuard.verify, UserController.getSelfData);
router.patch("/geo", TokenGuard.verify, Validator.validate(geoSetDTO), UserController.editGeo);
router.patch("/name", TokenGuard.verify, Validator.validate(nameEditDto), UserController.editName);
router.get("/achievements", TokenGuard.verify, UserController.getAchievements);
router.get("/avatars", TokenGuard.verify, UserController.getAccountAvatars);
router.patch("/words", TokenGuard.verify, UserController.patchWords);

export default router;
