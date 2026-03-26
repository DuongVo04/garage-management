import express from "express"
import { validate } from "../../middlewares/validation.middleware.js";
import employeeController from "../../controllers/employee.controller.js";
import { authorize, verifyToken } from "../../middlewares/auth.middleware.js";
import { paramsIdValidator } from "../../validators/id.validator.js";
import employeeValidator from "../../validators/employee.validator.js";

const router = express.Router();

router.get("/",
    verifyToken,
    authorize(["ADMIN"]),
    validate,
    employeeController.getAll
);

router.get("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    paramsIdValidator(),
    validate,
    employeeController.getById
);

router.post("/",
    verifyToken,
    authorize(["ADMIN"]),
    employeeValidator,
    validate,
    employeeController.create
);

router.put("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    paramsIdValidator(),
    employeeValidator,
    validate,
    employeeController.update
);

router.delete("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    paramsIdValidator(),
    validate,
    employeeController.delete
);

export default router;