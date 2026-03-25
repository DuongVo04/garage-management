import { body } from "express-validator"
import { nameValidator, priceValidator } from "./common.validator.js";
import { bodyIdValidator } from "./id.validator.js";

const showroomVehicleValidate = [

    nameValidator(2, 100),

    body("year")
        .notEmpty().withMessage("Year is required")
        .bail()
        .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
        .withMessage("Year must be a valid number"),

    priceValidator("old_price"),
    priceValidator("new_price"),

    body("status")
        .notEmpty().withMessage("Status is required")
        .bail()
        .isIn([0, 1, "0", "1"])
        .withMessage("Status must be 0 or 1"),

    body("color")
        .optional()
        .isLength({ max: 10 })
        .withMessage("Color must be <= 10 characters"),

    body("lastest_odo")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Odometer must be a positive integer"),

    body("thumbnail")
        .optional()
        .isLength({ max: 255 })
        .withMessage("Thumbnail must be <= 255 characters"),

    bodyIdValidator("brand_id")
]

export default showroomVehicleValidate;