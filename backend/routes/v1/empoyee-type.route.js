import express from "express";
import { validate } from "../../middlewares/validation.middleware.js"
import { employeeTypeController } from "../../controllers/empoyee-type.controller.js";
import { authorize, verifyToken } from "../../middlewares/auth.middleware.js";
import { paramsIdValidator } from "../../validators/id.validator.js";
import empoyeeTypeValidator from "../../validators/empoyee-type.validator.js";
import { response } from "../../utils/response.js";

const router = express.Router();

router.get("/",
    verifyToken,
    authorize(["ADMIN"]),
    async (req, res, next) => {
        try {
            const employeeTypes = await employeeTypeController.getAll(req.query);
            return response(res, true, "Get employee types successfully", 200, employeeTypes);
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
            const employeeType = await employeeTypeController.getById(id);
            return response(res, true, "Employee type found", 200, employeeType);
        } catch (error) {
            next(error);
        }
    }
);

router.post("/",
    verifyToken,
    authorize(["ADMIN"]),
    validate,
    async (req, res, next) => {
        try {
            const employeeType = await employeeTypeController.create(req.body);
            return response(res, true, "Create employee type successfully", 201, employeeType);
        } catch (error) {
            next(error);
        }
    }
);

router.put("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    paramsIdValidator(),
    empoyeeTypeValidator,
    validate,
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const employeeType = await employeeTypeController.update(id, req.body);
            return response(res, true, "Update employee type successfully", 200, employeeType);
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
            await employeeTypeController.delete(id);
            return response(res, true, "Employee type deleted", 200);
        } catch (error) {
            next(error);
        }
    }
);

export default router;