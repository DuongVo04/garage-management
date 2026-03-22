import { body } from "express-validator";
import { nameValidator } from "./common.validator.js";

const brandValidator = [
    nameValidator(3, 100),
    body("country")
        .notEmpty().withMessage("country is required")
        .bail()
        .isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters")
]

export default brandValidator;