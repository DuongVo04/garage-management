import express from "express"
import customerVehiclesController from "../../controllers/customer-vehicle.controller";
import { brandController } from "../../controllers/brand.controller.js"
import { paramsIdValidator } from "../../validators/id.validator.js"
import { validate } from "../../middlewares/validation.middleware.js"
import { authorize, verifyToken } from "../../middlewares/auth.middleware.js"
import customerValidator from "../../validators/customer.validator.js"
import customerController from "../../controllers/customer.controller.js"
import { response } from "../../utils/response.js"
import { uploadSingle } from "../../middlewares/upload.midleware.js";
import ROLE_NAME from "../../utils/RoleName.js";


const router = express.Router();

router.get("/:id",
    verifyToken,
    validate,
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const data = await customerVehiclesController.getById(id);
            return response(res, true, "Customer vehicle found", 200, data);
        } catch (error) {
            next(error);
        }
    }
);

router.post("/",
    verifyToken,
    uploadSingle("image_path", "customer-vehicles"),
    validate,
    async (req, res, next) => {
        try {
            const user = req.user;

            if (req.user.role_name === ROLE_NAME.ADMIN || req.user.role_name === ROLE_NAME.TECH_EMPLOYEE) {
                const data = await customerVehiclesController.create(req.body, req.uploadedFile);
                return response(res, true, "Create customer vehicle successfully", 201, data);
            }

            const data = await customerVehiclesController.create({
                ...req.body,
                customer_id: user.id
            }, req.uploadedFile);
            return response(res, true, "Create customer vehicle successfully", 201, data);

        } catch (error) {
            next(error);
        }
    }
)

router.put("/:id",
    verifyToken,
    uploadSingle("image_path", "customer-vehicles"),
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