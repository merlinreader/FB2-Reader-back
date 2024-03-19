import { Router } from "express";
import { Validator } from "../../core/validation.js";
import { TokenGuard } from "../common/middleware/token-guard.js";
import UserController from "./controller.js";
import { avatarNameDto } from "./dto/avatar-edit-dto.js";
import { nounsCheckDto } from "./dto/check-words-dto.js";
import { geoByCoordsDTO } from "./dto/geo-edit-dto.js";
import { loginDto } from "./dto/login-dto.js";
import { nameEditDto } from "./dto/name-edit-dto.js";

const router = new Router();

router.get("/auth", (req, res) => {
    res.redirect(`merlin://main/profile?token=${req.query.token}`);
});

router.post("/login", Validator.validate(loginDto), UserController.login);
router.get("/", TokenGuard.verify, UserController.getSelfData);
router.get("/geo-by-coords", Validator.validate(geoByCoordsDTO), UserController.getGeoByCoords);
router.patch("/geo-by-coords", TokenGuard.verify, Validator.validate(geoByCoordsDTO), UserController.editGeoByCoords);
router.patch("/name", TokenGuard.verify, Validator.validate(nameEditDto), UserController.editName);
router.get("/achievements", TokenGuard.verify, UserController.getAchievements);
router.get("/avatars", TokenGuard.verify, UserController.getAccountAvatars);
router.patch("/avatar", TokenGuard.verify, Validator.validate(avatarNameDto), UserController.patchAvatar);
router.patch("/words", TokenGuard.verify, UserController.patchWords);
router.get("/words", TokenGuard.verify, UserController.getWordsCount);
router.post("/words/nouns", Validator.validate(nounsCheckDto), UserController.checkNouns);

export default router;
