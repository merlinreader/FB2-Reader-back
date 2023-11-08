import { Router } from "express";
import { Validator } from "../../core/validation.js";
import { TokenGuard } from "../common/middleware/token-guard.js";
import UserController from "./controller.js";
import { geoSetDTO } from "./dto/geo-edit-dto.js";
import { loginDto } from "./dto/login-dto.js";
import { nameEditDto } from "./dto/name-edit-dto.js";

const router = new Router();

router.get("/widget", (req, res) => {
    res.send(`
  <!DOCTYPE html>
  <html>
  <body>
  <script async src="https://telegram.org/js/telegram-widget.js?22" data-telegram-login="merlin_auth_bot" data-size="large" data-auth-url="https://fb2.cloud.leam.pro/api/account/login" data-request-access="write"></script>
  </body>
  <html>
  `);
});

router.get("/loginEXP", (req, res) => {
    res.status(200);
});
router.post("/loginEXP", (req, res) => {
    console.log(req.body.message.chat);
    res.status(200).json({ message: "Success, yo-hooo", data: req.body.message.chat });
});
router.post("/login", Validator.validate(loginDto), UserController.login);
router.get("/", TokenGuard.verify, UserController.getSelfData);
router.patch("/geo", TokenGuard.verify, Validator.validate(geoSetDTO), UserController.editGeo);
router.patch("/name", TokenGuard.verify, Validator.validate(nameEditDto), UserController.editName);
router.get("/achievements", TokenGuard.verify, UserController.getAchievements);
router.put("/words", TokenGuard.verify, UserController.putWords);
router.get("/words", TokenGuard.verify, UserController.getWords);

export default router;
