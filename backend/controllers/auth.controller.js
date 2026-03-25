import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { response } from "../utils/response.js"
import { Account, Role } from "../schemas/index.js"
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js"
import redis from "../redis-connection.js"


const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const account = await Account.findOne({
            where: { username }
        });

        if (!account) {
            return response(res, false, "Invalid accound", 401);
        }
        if (!account.is_activated) {
            return response(res, false, "Your account has been disabled. Please contact this system admin", 401);
        }
        if (!(await bcrypt.compare(password, account.password))) {
            return response(res, false, "Wrong password", 401)
        }
        const role = await Role.findByPk(account.role_id);
        const payload = { id: account.id, role_id:role.id, role_name: role.name };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,

            // for production 
            // secure: true,
            // sameSite: "strict",

            // for development
            secure: false,
            sameSite: "lax",

            maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS) * 24 * 60 * 60 * 1000
        });

        return response(res, true, "Login successfully", 200, accessToken);

    } catch (error) {
        next(error);
    }
}

const logout = async (req, res, next) => {

    try {
        const authHeader = req.headers.authorization;
        const accessToken = authHeader?.split(" ")[1];

        const refreshToken = req.cookies.refreshToken;

        if (accessToken) {
            const decoded = jwt.decode(accessToken);
            const exp = decoded.exp - Math.floor(Date.now() / 1000);

            if (exp > 0) {
                await redis.set(`bl_${accessToken}`, "blacklisted", "EX", exp);
            }
        }
        if (refreshToken) {
            const decoded = jwt.decode(refreshToken);
            const exp = decoded.exp - Math.floor(Date.now() / 1000);

            if (exp > 0) {
                await redis.set(`bl_${refreshToken}`, "blacklisted", "EX", exp);
            }
        }

        res.clearCookie("refreshToken");
        return response(res, true, "Logout successfully", 200);
    } catch (error) {
        next(error);
    }

}

const refreshToken = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return response(res, false, "No refresh token", 401);
    }

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, user) => {
            if (err) {
                return response(res, false, "Invalid token", 401);
            }

            const accessToken = generateAccessToken({
                id: user.id,
                role_id: user.role_id
            });
            return response(res, true, "Access Token generated", 200, accessToken);
        }
    )
}

export {
    login,
    logout,
    refreshToken
}