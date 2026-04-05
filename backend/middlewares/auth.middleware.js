import jwt from "jsonwebtoken"
import { response } from "../utils/response.js";
import { Role } from "../schemas/index.js";
import redis from "../redis-connection.js";

export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        console.warn("⚠️ No Authorization header");
        return response(res, false, "Token missing", 401);
    }

    const token = authHeader.split(" ")[1];

    const isBlacklisted = await redis.get(`bl_${token}`);
    if (isBlacklisted) {
        console.warn("🚫 Token is blacklisted");
        return response(res, false, "The token has been blocked", 401);
    }

    try {
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
                if (err) {
                    console.error("❌ JWT verification failed:", err.message);
                    reject(err);
                } else {
                    resolve(user);
                }
            });
        });
        
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            console.warn("⏰ Token expired");
            return response(res, false, "Token expired", 401, null, "TOKEN_EXPIRED");
        }
        console.error("❌ Token invalid:", error.message);
        return response(res, false, "Invalid token", 401);
    }
}

export const authorize = (roles = []) => {
    return async (req, res, next) => {
        if (!req.user || !req.user.role_id) {
            return response(res, false, "Unauthorized", 401);
        }
        
        const role = await Role.findOne({
            where: {
                id: req.user.role_id,
                is_deleted: false
            }
        });
        if (!role) {
            return response(res, false, "Role not found", 404);
        }

        if (!roles.includes(role.name)) {
            return response(res, false, "Forbidden", 403);
        }
        next();
    };
}