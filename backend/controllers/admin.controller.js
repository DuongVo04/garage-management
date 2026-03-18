import { response } from '../utils/response.js'
import { Account, Role } from "../schemas/index.js"

const updateUserAccountStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { is_activated } = req.body;

        const account = await Account.findByPk(id, {
            include: {
                model: Role,
                attributes: ["name"]
            }
        });

        if (!account) {
            return response(res, false, "Account not found", 404);
        }
        if (account.Role?.name === "ADMIN") {
            return response(res, false, "Cannot change ADMIN account", 403);
        }

        await account.update({ is_activated });

        return response(
            res,
            true,
            is_activated ? "Account activated" : "Account deactivated",
            200
        );
    } catch (error) {
        next(error);
    }
};

export {
    updateUserAccountStatus,
}