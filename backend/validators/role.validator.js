import { descriptionValidator, nameValidator } from './common.validator.js';

const roleValidator = [
    nameValidator(2, 20),
    descriptionValidator,
]

export default roleValidator;