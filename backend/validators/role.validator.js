import { body } from 'express-validator'

const roleValidator = [
    body("name")
        .notEmpty().withMessage("Name is required")
        .bail()
        .isLength({ min: 3, max: 50 }).withMessage("Name must be between 3 and 50 characters"),

    body("description")
        .optional()
        .isLength({ max: 255 })
        .withMessage("Description max 255 characters")
]

export default roleValidator;