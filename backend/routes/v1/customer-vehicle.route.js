import express from "express"
import customerVehiclesController from "../../controllers/customer-vehicle.controller.js";
import { validate } from "../../middlewares/validation.middleware.js"
import { authorize, verifyToken } from "../../middlewares/auth.middleware.js"
import { response } from "../../utils/response.js"
import { uploadSingle } from "../../middlewares/upload.midleware.js";
import { Customer } from "../../schemas/index.js";
import customerVehicleValidator from "../../validators/customer-vehicle.validator.js";
import { bodyIdValidator } from "../../validators/id.validator.js";
import ROLE_NAME from "../../utils/RoleName.js"


const router = express.Router();

router.get("/:id",
    verifyToken,
    validate,
    async (req, res, next) => {
        try {

            const user = req.user;
            if (user.role_name === ROLE_NAME.ADMIN) {
                return response(res, false, "Not a customer", 201);
            }

            const customer = await Customer.findOne({
                where: { account_id: user.id }
            });

            const { id } = req.params;
            const data = await customerVehiclesController.getVehicleById(id, customer.id);
            return response(res, true, "Customer vehicle found", 200, data);
        } catch (error) {
            next(error);
        }
    }
);

router.post("/",
    verifyToken,
    uploadSingle("image", "customer-vehicles"),
    customerVehicleValidator,
    validate,
    async (req, res, next) => {
        try {
            const user = req.user;
            if (user.role_name === ROLE_NAME.ADMIN) {
                return response(res, false, "Not a customer", 201);
            }

            const customer = await Customer.findOne({
                where: { account_id: user.id }
            });
            if (!customer) {
                return response(res, false, "Need to register customer", 201, data);
            }

            const request = {
                ...req.body,
                customer_id: customer.id
            }

            const data = await customerVehiclesController.create(request, req.uploadedFile);
            return response(res, true, "Create customer vehicle successfully", 201, data);

        } catch (error) {
            next(error);
        }
    }
)

router.put("/:id",
    verifyToken,
    uploadSingle("image", "customer-vehicles"),
    validate,
    async (req, res, next) => {
        try {
            const user = req.user;
            const { id } = req.params;
            if (user.role_name === ROLE_NAME.ADMIN) {
                return response(res, false, "Not a customer", 201);
            }

            const customer = await Customer.findOne({
                where: { account_id: user.id }
            });
            if (!customer) {
                return response(res, false, "Need to register customer", 201, data);
            }
            const updatedData = {
                ...req.body,
                customer_id: customer.id
            }
            const data = await customerVehiclesController.update(id, updatedData, req.uploadedFile);
            return response(res, true, "Update customer vehicle successfully", 200, data);
        } catch (error) {
            next(error);
        }
    }
)

router.get("/",
    verifyToken,
    authorize([ROLE_NAME.ADMIN]),
    validate,
    async (req, res, next) => {
        try {
            const data = await customerVehiclesController.getAll({ is_deleted: false });
            return response(res, true, "Customer vehicle found", 200, data);
        } catch (error) {
            next(error);
        }
    }
);

router.get("/by-admin/:vehicle_id/:customer_id",
    verifyToken,
    validate,
    async (req, res, next) => {
        try {

            const { vehicle_id, customer_id } = req.params;
            const data = await customerVehiclesController.getVehicleById(vehicle_id, customer_id);
            return response(res, true, "Customer vehicle found", 200, data);
        } catch (error) {
            next(error);
        }
    }
);

router.post("/by-admin",
    verifyToken,
    authorize([ROLE_NAME.ADMIN]),
    uploadSingle("image", "customer-vehicles"),
    customerVehicleValidator,
    bodyIdValidator("customer_id"),
    validate,
    async (req, res, next) => {
        try {
            const data = await customerVehiclesController.create(req.body, req.uploadedFile);
            return response(res, true, "Create customer vehicle successfully", 201, data);
        } catch (error) {
            next(error);
        }
    }
)

router.put("/by-admin/:id",
    verifyToken,
    authorize([ROLE_NAME.ADMIN]),
    uploadSingle("image", "customer-vehicles"),
    customerVehicleValidator,
    validate,
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const data = await customerVehiclesController.update(id, req.body, req.uploadedFile);
            return response(res, true, "Update customer vehicle successfully", 200, data);
        } catch (error) {
            next(error);
        }
    }
)

export default router;