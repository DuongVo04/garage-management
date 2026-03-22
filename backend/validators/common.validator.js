import { body } from "express-validator";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

export const usernameValidator = body("username")
    .isLength({ min: 3, max: 100 }).withMessage("Name must be between 3 and 100 characters")
    .bail()
    .notEmpty().withMessage("User name is required")
    .bail()
    .matches(/^\S+$/).withMessage("Username must not contain spaces");

export const passwordValidator = (field) => body(field)
    .notEmpty().withMessage(`${field} cannot be blank`)
    .bail()
    .matches(/^\S+$/).withMessage("Password must not contain spaces")
    .bail()
    .isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0
    }).withMessage("Password must be at least 6 characters and include uppercase, lowercase and number")

export const nameValidator = (minLen = 1, maxLen = 20) => body("name")
    .notEmpty().withMessage("Name is required")
    .bail()
    .isLength({ min: minLen, max: maxLen }).withMessage(`Name must be between ${minLen} and ${maxLen} characters`)

export const descriptionValidator = body("description")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Description max 255 characters")


dayjs.extend(utc);
dayjs.extend(timezone);

export const dateValidator = (field, label = "Date") => {
    return body(field)
        .notEmpty().withMessage(`${label} is required`)
        .bail()
        .isISO8601().withMessage(`${label} must be a valid ISO date`)
        .bail()
        .customSanitizer((value) => {
            return dayjs(value).toDate();
        });
};

export const priceValidator = (feild) => body(feild)
        .isNumeric().withMessage("Must be of numeric type")
        .bail()
        .isInt({ min: 1 }).withMessage("Price must be greater than 0");