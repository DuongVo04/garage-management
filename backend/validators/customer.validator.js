import { body } from "express-validator";
import { nameValidator, phoneNumberValidator } from "./common.validator.js";
import { bodyIdValidator } from "./id.validator.js";

const customerValidator = [
    nameValidator(3, 50, "full_name"),
    phoneNumberValidator,
    body("email")
        .optional({ nullable: true, checkFalsy: true })
        .isEmail().withMessage("Invalid email format")
        .isLength({ max: 100 }).withMessage("Max length is 100 characters"),
    body("address")
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ max: 100 }).withMessage("Max length is 100 characters"),

]

export default customerValidator