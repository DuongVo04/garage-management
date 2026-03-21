import { body } from "express-validator";
import { nameValidator } from "./common.validator.js";

const sparePartsValidator = [
    nameValidator,

    body("quantity_in_stock")
        .notEmpty().withMessage("Quantity in stock can required")
        .bail()
        .isNumeric().withMessage("must be of numeric type")
        .bail()
        .isInt({ min: 1 }).withMessage("Price must be greater than 0"),

    body("unit_price")
        .isNumeric().withMessage("must be of numeric type")
        .bail()
        .isInt({ min: 1 }).withMessage("Price must be greater than 0"),
]

export default sparePartsValidator;