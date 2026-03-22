import { body } from "express-validator";
import { nameValidator, priceValidator } from "./common.validator.js";

const sparePartsValidator = [
    nameValidator(3, 100),

    body("quantity_in_stock")
        .notEmpty().withMessage("Quantity in stock can required")
        .bail()
        .isNumeric().withMessage("must be of numeric type")
        .bail()
        .isInt({ min: 1 }).withMessage("Price must be greater than 0"),

    priceValidator("unit_price")
]

export default sparePartsValidator;