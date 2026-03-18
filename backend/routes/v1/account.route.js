import express from 'express'
import { validate } from '../../middlewares/validation.middleware.js'
import accountValidator from '../../validators/account.validator.js'
import { 
    changePassword,
    registerAccount
} from '../../controllers/account.controller.js'
import { passwordValidator } from '../../validators/common.validator.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';


const router = express.Router();

router.post("/", accountValidator, validate, registerAccount);
router.post("/password",
    verifyToken,
    passwordValidator("old_password"),
    passwordValidator("new_password"),
    validate,
    changePassword
);

export default router;