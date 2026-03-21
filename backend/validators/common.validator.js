import { body } from "express-validator";

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

export const nameValidator = body("name")
        .notEmpty().withMessage("Name is required")
        .bail()
        .isLength({ min: 3, max: 50 }).withMessage("Name must be between 3 and 50 characters")

export const descriptionValidator = body("description")
        .optional()
        .isLength({ max: 255 })
        .withMessage("Description max 255 characters")