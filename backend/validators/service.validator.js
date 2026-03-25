import { body } from "express-validator";
import { descriptionValidator, nameValidator, priceValidator } from "./common.validator.js";

const serviceValidator = [
    nameValidator(3, 50),
    descriptionValidator,
    priceValidator("price")
]

export default serviceValidator;