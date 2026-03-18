import { usernameValidator, passwordValidator } from "./common.validator.js";

const loginValidator = [
    usernameValidator,
    passwordValidator("password"),
];

export default loginValidator;