import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { response } from '../utils/response.js'
import { Account, Role } from "../schemas/index.js"

dotenv.config();
const salt = Number(process.env.SALT_PASSWORD);

const registerAccount = async (req, res, next) => {
    try {

        const { username, password } = req.body;

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
            return response(res, false, "Could not create account", 400);
        }

        if (existingUsername) {
            return response(res, false, "Username existed", 409);
        }

        const hashPassword = await bcrypt.hash(password, salt);

        const newAccount = await Account.create({
            username,
            password: hashPassword,
            role_id: existingRole.id,
            is_activated: true
        });

        return response(res, true, "Create account successfully", 201, {
            id: newAccount.id,
            username: newAccount.username,
            rolename: existingRole.name
        });

    } catch (error) {
        next(error);
    }
};

const changePassword = async (req, res, next) => {
    try {
        const id = req.user.id;
        const { old_password, new_password } = req.body;

        const account = await Account.findByPk(id);
        if (!account) {
            return response(res, false, "Invalid account", 404);
        }

        if (!(await bcrypt.compare(old_password, account.password))) {
            return response(res, false, "The old password you just entered doesn't match", 400);
        }

        const hashNewPassword = await bcrypt.hash(new_password, salt);
        await Account.update(
            { password: hashNewPassword },
            { where: { id } }
        );

        return response(res, true, "Password updated", 200);
    } catch (error) {
        next(error)
    }

};

export {
    registerAccount,
    changePassword,

};