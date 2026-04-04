import ApiError from "../utils/ApiError.js"
import { Account, Role } from "../schemas/index.js"

const updateUserAccountStatus = async (id, { is_activated }) => {
    const account = await Account.findByPk(id, {
        include: {
            model: Role,
            attributes: ["name"]
        }
    });

    if (!account) {
        throw new ApiError(404, "Account not found");
    }
    if (account.Role?.name === "ADMIN") {
        throw new ApiError(403, "Cannot change ADMIN account");
    }

    await account.update({ is_activated });

    return is_activated ? "Account activated" : "Account deactivated";
};

export {
    updateUserAccountStatus,
}
