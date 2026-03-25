import express from "express";
import { validate } from "../../middlewares/validation.middleware.js"
import { employeeTypeController } from "../../controllers/empoyee-type.controller.js";
import { authorize, verifyToken } from "../../middlewares/auth.middleware.js";
import { paramsIdValidator } from "../../validators/id.validator.js";
import empoyeeTypeValidator from "../../validators/empoyee-type.validator.js";

const router = express.Router();

router.get("/",
    verifyToken,
    authorize(["ADMIN"]),
    employeeTypeController.getAll
);

router.get("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    paramsIdValidator(),
    validate,
    employeeTypeController.getById
);

router.post("/",
    verifyToken,
    authorize(["ADMIN"]),
    validate,
    employeeTypeController.create
);

router.put("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    paramsIdValidator(),
    empoyeeTypeValidator,
    validate,
    employeeTypeController.update
);

router.delete("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    paramsIdValidator(),
    employeeTypeController.delete
);

export default router;