import { descriptionValidator, nameValidator } from "./common.validator.js";

const empoyeeTypeValidator = [
    nameValidator,
    descriptionValidator,
]

export default empoyeeTypeValidator;