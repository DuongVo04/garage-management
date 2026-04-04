import express from "express";
import { login, refreshToken, logout } from "../../controllers/auth.controller.js"
import { validate } from "../../middlewares/validation.middleware.js"
import accountalidator from "../../validators/account.validator.js"
import { response } from "../../utils/response.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", accountalidator, validate, async (req, res, next) => {
    try {
        const { accessToken, refreshToken } = await login(req.body);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS) * 24 * 60 * 60 * 1000
        });
        return response(res, true, "Login successfully", 200, accessToken);
    } catch (error) {
        next(error);
    }
});

router.post("/refresh-token", async (req, res, next) => {
    try {
        const refreshTokenValue = req.cookies.refreshToken;
        const accessToken = await refreshToken(refreshTokenValue);
        return response(res, true, "Access Token generated", 200, accessToken);
    } catch (error) {
        next(error);
    }
});

router.post("/logout", async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const accessToken = authHeader?.split(" ")[1];
        const refreshToken = req.cookies.refreshToken;
        await logout(accessToken, refreshToken);
        res.clearCookie("refreshToken");
        return response(res, true, "Logout successfully", 200);
    } catch (error) {
        next(error);
    }
});

export default router;