import { descriptionValidator, nameValidator } from './common.validator.js';

const roleValidator = [
    nameValidator,
    descriptionValidator
]

export default roleValidator;