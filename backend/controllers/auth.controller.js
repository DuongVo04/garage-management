import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import ApiError from "../utils/ApiError.js"
import { Account, Role } from "../schemas/index.js"
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js"
import redis from "../redis-connection.js"


const login = async ({ username, password }) => {
    const account = await Account.findOne({
        where: { username }
    });

    if (!account) {
        throw new ApiError(401, "Invalid account");
    }
    if (!account.is_activated) {
        throw new ApiError(401, "Your account has been disabled. Please contact this system admin");
    }
    if (!(await bcrypt.compare(password, account.password))) {
        throw new ApiError(401, "Wrong password");
    }
    const role = await Role.findByPk(account.role_id);
    const payload = { id: account.id, username: account.username, role_id:role.id, role_name: role.name };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { accessToken, refreshToken, payload };
}

const logout = async (accessToken, refreshToken) => {
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

    return true;
}

const refreshToken = async (refreshToken) => {
    if (!refreshToken) {
        throw new ApiError(401, "No refresh token");
    }

    return new Promise((resolve, reject) => {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, user) => {
                if (err) {
                    reject(new ApiError(401, "Invalid token"));
                } else {
                    const accessToken = generateAccessToken({
                        id: user.id,
                        username: user.username,
                        role_id: user.role_id,
                        role_name: user.role_name
                    });
                    resolve(accessToken);
                }
            }
        );
    });
}

export {
    login,
    logout,
    refreshToken
}
