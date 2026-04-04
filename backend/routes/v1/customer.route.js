import express from "express"
import { paramsIdValidator } from "../../validators/id.validator.js"
import { validate } from "../../middlewares/validation.middleware.js"
import { authorize, verifyToken } from "../../middlewares/auth.middleware.js"
import customerValidator from "../../validators/customer.validator.js"
import customerController from "../../controllers/customer.controller.js"
import { response } from "../../utils/response.js"
import ROLE_NAME from "../../utils/RoleName.js"
import { phoneNumberValidator } from "../../validators/common.validator.js"


const router = express.Router();

router.get("/me",
    verifyToken,
    validate,
    async (req, res, next) => {
        try {
            const user = req.user;
            if (user.role_name !== ROLE_NAME.CUSTOMER) {
                return response(res, false, "Not a customer", 404);
            }

            const customer = await customerController.getMe(user);
            return response(res, true, "Get your infor successfully", 200, customer);
        } catch (error) {
            next(error);
        }
    }
);

router.post("/",
    verifyToken,
    customerValidator,
    validate,
    async (req, res, next) => {
        try {

            const user = req.user;
            if (user.role_name !== ROLE_NAME.CUSTOMER) {
                return response(res, false, "Not a customer", 404);
            }

            const data = await customerController.create({
                ...req.body,
                account_id: user.id
            });
            return response(res, true, "Create customer successfully", 201, data);
        } catch (error) {
            next(error);
        }
    }
)

router.put("/",
    verifyToken,
    customerValidator,
    validate,
    async (req, res, next) => {
        try {
            const user = req.user;
            if (user.role_name !== ROLE_NAME.CUSTOMER) {
                return response(res, false, "Not a customer", 404);
            }

            const customer = await customerController.update(user.id, req.body);
            return response(res, true, "Update customer successfully", 200, customer);
        } catch (error) {
            next(error);
        }
    }
)


router.get("/by-admin",
    verifyToken,
    authorize(["ADMIN"]),
    validate,
    async (req, res, next) => {
        try {
            const customers = await customerController.getAll();
            return response(res, true, "Get customers successfully", 200, customers);
        } catch (error) {
            console.error(error);
            next(error);
        }
    }
);

router.get("/by-admin/:id",
    verifyToken,
    authorize(["ADMIN"]),
    paramsIdValidator(),
    validate,
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const customer = await customerController.getById(id);

            return response(res, true, "Get customer successfully", 200, customer);
        } catch (error) {
            next(error);
        }
    }
);

router.post("/by-admin",
    verifyToken,
    authorize(["ADMIN"]),
    customerValidator,
    validate,
    async (req, res, next) => {
        try {
            const data = await customerController.create(req.body);

            return response(res, true, "Create customer successfully", 201, data);
        } catch (error) {
            next(error);
        }
    }
)

router.put("/by-admin/:customer_id",
    verifyToken,
    authorize(["ADMIN"]),
    paramsIdValidator("customer_id"),
    customerValidator,
    validate,
    async (req, res, next) => {
        try {
            const { customer_id } = req.params;

            const customer = await customerController.update(customer_id, req.body);
            return response(res, true, "Update customer successfully", 200, customer);
        } catch (error) {
            next(error);
        }
    }
)

router.patch("/link-account",
    verifyToken,
    phoneNumberValidator,
    validate,
    async (req, res, next) => {
        try {
            const user = req.user;

            if (user.role_name !== ROLE_NAME.CUSTOMER) {
                return response(res, false, "Not a customer", 404);
            }

            const { phone_number } = req.body;

            await customerController.linkAccount(user, phone_number);
            return response(res, true, "Link account successfully", 200);
        } catch (error) {
            next(error);
        }
    }
)

export default router;