import express from 'express'
import { validate } from '../../middlewares/validation.middleware.js'
import accountValidator from '../../validators/account.validator.js'
import { 
    changePassword,
    registerAccount
} from '../../controllers/account.controller.js'
import { passwordValidator } from '../../validators/common.validator.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { response } from '../../utils/response.js';


const router = express.Router();

router.post("/", accountValidator, validate, async (req, res, next) => {
    try {
        const data = await registerAccount(req.body);
        return response(res, true, "Create account successfully", 201, data);
    } catch (error) {
        next(error);
    }
});

router.post("/password",
    verifyToken,
    passwordValidator("old_password"),
    passwordValidator("new_password"),
    validate,
    async (req, res, next) => {
        try {
            await changePassword(req.user, req.body);
            return response(res, true, "Password updated", 200);
        } catch (error) {
            next(error);
        }
    }
);

export default router;