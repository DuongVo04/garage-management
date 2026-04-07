import { body } from "express-validator";
import { dateValidator } from "./common.validator.js";
import { bodyIdValidator } from "./id.validator.js";

const sparePartsUsageValidator = [
    body("quantity")
        .notEmpty().withMessage("Quantity is required")
        .isInt({ min: 1 }).withMessage("Quantity must be a positive integer"),

    dateValidator("usage_date", "Usage date"),

    bodyIdValidator("spare_parts_id")
];

export default sparePartsUsageValidator;