import express from 'express'
import { roleController } from "../../controllers/role.controller.js";
import { validate } from '../../middlewares/validation.middleware.js'
import { verifyToken, authorize } from "../../middlewares/auth.middleware.js"
import roleValidator from '../../validators/role.validator.js'
import { paramsIdValidator } from '../../validators/id.validator.js'
import { response } from '../../utils/response.js'


const router = express.Router()

router.get("/",
    verifyToken,
    authorize(["ADMIN"]),
    async (req, res, next) => {
        try {
            const roles = await roleController.getAll();
            return response(res, true, "Get roles successfully", 200, roles);
        } catch (error) {
            next(error);
        }
    }
);

router.get("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    paramsIdValidator(),
    validate,
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const role = await roleController.getById(id);
            return response(res, true, "Role found", 200, role);
        } catch (error) {
            next(error);
        }
    }
);

router.post("/",
    verifyToken,
    authorize(["ADMIN"]),
    roleValidator,
    validate,
    async (req, res, next) => {
        try {
            const role = await roleController.create(req.body, req.uploadedFile);
            return response(res, true, "Create role successfully", 201, role);
        } catch (error) {
            next(error);
        }
    }
);

router.put("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    paramsIdValidator(),
    roleValidator,
    validate,
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const role = await roleController.update(id, req.body, req.uploadedFile);
            return response(res, true, "Update role successfully", 200, role);
        } catch (error) {
            next(error);
        }
    }
);

router.delete("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    paramsIdValidator(),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            await roleController.delete(id);
            return response(res, true, "Role deleted", 200);
        } catch (error) {
            next(error);
        }
    }
);

export default router