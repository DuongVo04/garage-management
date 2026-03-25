import { descriptionValidator, nameValidator } from "./common.validator.js";

const empoyeeTypeValidator = [
    nameValidator(3, 20),
    descriptionValidator,
]

export default empoyeeTypeValidator;