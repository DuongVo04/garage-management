import { body } from "express-validator";
import { dateValidator } from "./common.validator.js";

const voucherValidator = [

    body("code")
        .notEmpty().withMessage("Code is required")
        .bail()
        .isString().withMessage("Code must be a string")
        .isLength({ min: 3, max: 20 }).withMessage("Name must be between 3 and 20 characters"),


    dateValidator("from", "From date"),

    dateValidator("to", "To date")
        .custom((value, { req }) => {
            if (value <= req.body.from) {
                throw new Error("To date must be greater than From date");
            }
            return true;
        }),

    body("percent")
        .notEmpty().withMessage("Percent is required")
        .isInt({ min: 0, max: 100 })
        .withMessage("Percent must be between 0 and 100"),

    body("event")
        .isString().withMessage("Event must be a string")
        .isLength({ max: 255 }),
]

export default voucherValidator;