import express from "express"
import { validate } from "../../middlewares/validation.middleware.js";
import employeeController from "../../controllers/employee.controller.js";
import { authorize, verifyToken } from "../../middlewares/auth.middleware.js";
import { paramsIdValidator } from "../../validators/id.validator.js";
import employeeValidator from "../../validators/employee.validator.js";
import { response } from "../../utils/response.js";

const router = express.Router();

router.get("/",
    verifyToken,
    authorize(["ADMIN"]),
    validate,
    async (req, res, next) => {
        try {
            const employees = await employeeController.getAll(req.query);
            return response(res, true, "Get employees successfully", 200, employees);
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
            const employee = await employeeController.getById(id);
            return response(res, true, "Employee found", 200, employee);
        } catch (error) {
            next(error);
        }
    }
);

router.post("/",
    verifyToken,
    authorize(["ADMIN"]),
    employeeValidator,
    validate,
    async (req, res, next) => {
        try {
            const employee = await employeeController.create(req.body);
            return response(res, true, "Create employee successfully", 201, employee);
        } catch (error) {
            next(error);
        }
    }
);

router.put("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    paramsIdValidator(),
    employeeValidator,
    validate,
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const employee = await employeeController.update(id, req.body);
            return response(res, true, "Update employee successfully", 200, employee);
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
            await employeeController.delete(id);
            return response(res, true, "Employee deleted", 200);
        } catch (error) {
            next(error);
        }
    }
);

export default router;