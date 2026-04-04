import express from 'express'
import serviceController from "../../controllers/service.controller.js"
import { validate } from '../../middlewares/validation.middleware.js'
import { authorize, verifyToken } from '../../middlewares/auth.middleware.js'
import serviceValidator from '../../validators/service.validator.js'
import { paramsIdValidator } from '../../validators/id.validator.js'
import { response } from '../../utils/response.js'


const router = express.Router();

router.get("/",
    async (req, res, next) => {
        try {
            const services = await serviceController.getAll(req.query);
            return response(res, true, "Get services successfully", 200, services);
        } catch (error) {
            next(error);
        }
    }
);

router.get("/:id",
    paramsIdValidator(),
    validate,
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const service = await serviceController.getById(id);
            return response(res, true, "Service found", 200, service);
        } catch (error) {
            next(error);
        }
    }
);

router.post("/",
    verifyToken,
    authorize(["ADMIN"]),
    serviceValidator,
    validate,
    async (req, res, next) => {
        try {
            const service = await serviceController.create(req.body);
            return response(res, true, "Create service successfully", 201, service);
        } catch (error) {
            next(error);
        }
    }
);

router.put("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    paramsIdValidator(),
    serviceValidator,
    validate,
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const service = await serviceController.update(id, req.body);
            return response(res, true, "Update service successfully", 200, service);
        } catch (error) {
            next(error);
        }
    }
);

router.delete("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    paramsIdValidator(),
    validate,
    async (req, res, next) => {
        try {
            const { id } = req.params;
            await serviceController.delete(id);
            return response(res, true, "Service deleted", 200);
        } catch (error) {
            next(error);
        }
    }
);

export default router;