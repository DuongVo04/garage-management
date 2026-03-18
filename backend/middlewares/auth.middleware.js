import jwt from "jsonwebtoken"
import { response } from "../utils/response.js";
import { Role } from "../schemas/index.js";
import redis from "../redis-connection.js";

export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return response(res, false, "Token missing", 401);
    }

    const token = authHeader.split(" ")[1];

    const isBlacklisted = await redis.get(`bl_${token}`);
    if (isBlacklisted) {
        return response(res, false, "The token has been blocked", 401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
             if (err) {

                if (err.name === "TokenExpiredError") {
                return response(res, false, "Token expired", 401, null, "TOKEN_EXPIRED");
            }

            return response(res, false, "Invalid token", 401);
        }
        }
        req.user = decoded;

        next();
    })
}

export const authorize = (roles = []) => {
    return async (req, res, next) => {
        const role = await Role.findOne({
            where: {
                id: req.user.role_id,
                is_deleted: false
            }
        });
        if (!role) {
            return response(res, false, "Role not found", 404);
        }
        console.log(role);

        if (!roles.includes(role.name)) {
            return response(res, false, "Forbidden", 403);
        }
        next();
    };
}