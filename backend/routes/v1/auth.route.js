import express from "express";
import { login, refreshToken, logout } from "../../controllers/auth.controller.js"
import { validate } from "../../middlewares/validation.middleware.js"
import accountalidator from "../../validators/account.validator.js"

const router = express.Router();

router.post("/login", accountalidator, validate, login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

export default router;