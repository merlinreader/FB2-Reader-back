import { Router } from "express";
import UserController from "./controller.js";

const router = new Router();

router.get("/widget", (req, res) => {
    res.send(`<!DOCTYPE html>
  <html>
  <body>
  <script async src="https://telegram.org/js/telegram-widget.js?22" data-telegram-login="merlin_auth_bot" data-size="large" data-auth-url="https://aipro-energy.leam.pro/login" data-request-access="write"></script>
</body>
  <html>`);
});

router.get("", UserController.login);

export default router;
