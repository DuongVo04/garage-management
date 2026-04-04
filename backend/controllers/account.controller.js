import bcrypt from "bcrypt";
import dotenv from "dotenv";
import ApiError from "../utils/ApiError.js"
import { Account, Role } from "../schemas/index.js"

dotenv.config();
const salt = Number(process.env.SALT_PASSWORD);

const registerAccount = async ({ username, password }) => {
    const [existingRole, existingUsername] = await Promise.all([
        Role.findOne({
            where: {
                name: "CUSTOMER"
            }
        }),
        Account.findOne({
            where: {
                username,
            }
        })
    ]);

    if (!existingRole) {
        throw new ApiError(400, "Could not create account");
    }

    if (existingUsername) {
        throw new ApiError(409, "Username existed");
    }

    const hashPassword = await bcrypt.hash(password, salt);

    const newAccount = await Account.create({
        username,
        password: hashPassword,
        role_id: existingRole.id,
        is_activated: true
    });

    return {
        id: newAccount.id,
        username: newAccount.username,
        rolename: existingRole.name
    };
};

const changePassword = async (user, { old_password, new_password }) => {
    const id = user.id;

    const account = await Account.findByPk(id);
    if (!account) {
        throw new ApiError(404, "Invalid account");
    }

    if (!(await bcrypt.compare(old_password, account.password))) {
        throw new ApiError(400, "The old password you just entered doesn't match");
    }

    const hashNewPassword = await bcrypt.hash(new_password, salt);
    await Account.update(
        { password: hashNewPassword },
        { where: { id } }
    );

    return true;
};

export {
    registerAccount,
    changePassword,
};
